/**
 * CDP overflow/responsive auditor.
 * Launches headless Chrome, visits the URL at several widths and reports
 * elements whose content overflows the viewport horizontally.
 *
 *   node scripts/audit-responsive.mjs [url] [widths...]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] || "http://localhost:3000/";
const widths = (process.argv.slice(3).length ? process.argv.slice(3) : [
  "320", "360", "390", "414", "768", "1024",
]).map(Number);
const PORT = 9333 + Math.floor(Math.random() * 400);

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu",
  "--hide-scrollbars",
  "--user-data-dir=/tmp/cdp-audit-" + PORT,
  "about:blank",
], { stdio: "ignore" });

async function targetWs() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome did not expose a debugging target");
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener("message", (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`timeout: ${method}`));
        }
      }, 45000);
    });
  }
}

const fs = await import("node:fs/promises");

const ws = new WebSocket(await targetWs());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const cdp = new Cdp(ws);

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");

const PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const docW = document.documentElement.scrollWidth;
  const out = { vw, docW, horizScroll: docW > vw + 1, over: [], clip: [], tap: [] };
  const seen = new Set();

  const hasScroller = (el) => {
    let p = el.parentElement;
    while (p && p !== document.documentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === 'auto' || o === 'scroll') return true;   // intentional carousel
      p = p.parentElement;
    }
    return false;
  };
  // ancestor clips its content => content becomes unreachable at this width
  const clipped = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const o = getComputedStyle(p).overflowX;
      if (o === 'hidden' || o === 'clip') return true;
      p = p.parentElement;
    }
    return false;
  };

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const txt = (el.textContent || '').trim().replace(/\\s+/g, ' ');
    const cls = (el.className && el.className.toString()) || '';
    const key = el.tagName + '|' + cls.slice(0, 90);

    // 1. sticks out of the viewport, in a non-scrolling context
    const worst = Math.max(r.right - vw, -r.left);
    if (worst > 1.5 && !hasScroller(el) && !clipped(el)) {
      if (!seen.has('o' + key)) { seen.add('o' + key);
        out.over.push({ tag: el.tagName.toLowerCase(), cls: cls.slice(0, 130), over: Math.round(worst),
          w: Math.round(r.width), L: Math.round(r.left), R: Math.round(r.right), txt: txt.slice(0, 45) }); }
    }

    // 2. own content wider than itself (text/children clipped by its own box)
    if (el.scrollWidth > el.clientWidth + 2 && cs.overflowX === 'visible' && el.clientWidth > 0) {
      if (!seen.has('c' + key)) { seen.add('c' + key);
        out.clip.push({ tag: el.tagName.toLowerCase(), cls: cls.slice(0, 130),
          need: el.scrollWidth, have: el.clientWidth, txt: txt.slice(0, 45) }); }
    }

    // 3. interactive targets that are too small to tap comfortably
    if (/^(A|BUTTON)$/.test(el.tagName) && txt && !el.closest('[role="region"]')) {
      if (r.height < 32 || r.width < 32) {
        if (!seen.has('t' + key + Math.round(r.height))) { seen.add('t' + key + Math.round(r.height));
          out.tap.push({ tag: el.tagName.toLowerCase(), cls: cls.slice(0, 110),
            w: Math.round(r.width), h: Math.round(r.height), txt: txt.slice(0, 35) }); }
      }
    }
  }
  const byO = (a,b) => b.over - a.over;
  out.over.sort(byO);
  out.clip.sort((a,b) => (b.need - b.have) - (a.need - a.have));
  out.over = out.over.slice(0, 12);
  out.clip = out.clip.slice(0, 12);
  out.tap = out.tap.slice(0, 8);
  return out;
})()`;

const fmt = (r) => {
  console.log(`\n=== ${r.vw}px ===  scrollWidth=${r.docW}${r.horizScroll ? "  <-- PAGE SCROLLS HORIZONTALLY" : ""}`);
  if (!r.over.length) console.log("  [ok] nothing escapes the viewport");
  for (const b of r.over)
    console.log(`  OVER  +${b.over}px  <${b.tag}> w=${b.w}  "${b.txt}"\n        ${b.cls}`);
  if (!r.clip.length) console.log("  [ok] no self-clipped content");
  for (const b of r.clip)
    console.log(`  CLIP  needs ${b.need}px has ${b.have}px  <${b.tag}>  "${b.txt}"\n        ${b.cls}`);
  for (const b of r.tap)
    console.log(`  TAP   ${b.w}x${b.h}  <${b.tag}>  "${b.txt}"\n        ${b.cls}`);
};

let failed = false;
for (const w of widths) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768,
  });
  await cdp.send("Page.navigate", { url });
  await sleep(4200);

  // Scroll the whole page so IntersectionObserver reveals fire and lazy
  // images decode, then return to the top before measuring.
  await cdp.send("Runtime.evaluate", {
    expression: `(async () => {
      const step = innerHeight * 0.6;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        scrollTo(0, y);
        await new Promise(r => setTimeout(r, 220));
      }
      scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
      // force any remaining reveal animations to their end state
      document.querySelectorAll('[class*="opacity-0"]').forEach(e => {
        if (e.className.includes('translate-y-')) e.className = e.className
          .replace(/translate-y-6/g, 'translate-y-0').replace(/\s*opacity-0/g, '');
      });
    })()`,
    returnByValue: true, awaitPromise: true,
  });
  await sleep(1500);

  const { result } = await cdp.send("Runtime.evaluate", {
    expression: PROBE, returnByValue: true, awaitPromise: true,
  });
  if (!result?.value) { console.log(`\n=== ${w}px === (no result)`); failed = true; continue; }
  fmt(result.value);

  if (process.env.NAVBAR) {
    // Open the mobile panel so the Favourites entry can be checked at 320px.
    if (w < 1024) {
      await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const b = document.querySelector("nav[aria-label='Main'] button[aria-controls='mobile-menu']");
          if (b) b.click();
        })()`, returnByValue: true,
      });
      await sleep(900);
    }
    // Narrow capture of the fixed navbar + the CTA card at each width.
    for (const [name, sel] of [
      ["nav", "nav[aria-label='Main']"],
      ["panel", "#mobile-menu"],
      ["cta", "section[aria-labelledby='cta-heading'] .relative.overflow-hidden.rounded-sm"],
      ["atelier", "section[aria-labelledby='atelier-heading'] figure"],
    ]) {
      const { result: box } = await cdp.send("Runtime.evaluate", {
        expression: `(() => { const e = document.querySelector(${JSON.stringify(sel)});
          if (!e) return null; const r = e.getBoundingClientRect();
          return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; })()`,
        returnByValue: true,
      });
      if (!box?.value) { console.log(`  (${name} not found)`); continue; }
      const b = box.value;
      const shot = await cdp.send("Page.captureScreenshot", {
        format: "png", captureBeyondViewport: true,
        clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 },
      });
      const file = `${process.env.NAVBAR}/${name}-${w}.png`;
      await fs.writeFile(file, Buffer.from(shot.data, "base64"));
      console.log(`  shot ${name} -> ${file} (${Math.round(b.w)}x${Math.round(b.h)})`);
    }
  }

  if (process.env.SHOTS) {
    // Capture each home section separately so details stay legible.
    const sections = [
      ["hero", "section[aria-labelledby='hero-heading']"],
      ["offer", "main > div:nth-child(2)"],
      ["categories", "section[aria-labelledby='categories-heading']"],
      ["featured", "section[aria-label='Featured collection']"],
      ["about", "section[aria-labelledby='about-heading']"],
      ["testimonials", "section[aria-label='Customer testimonials']"],
      ["atelier", "section[aria-labelledby='atelier-heading']"],
      ["cta", "section[aria-labelledby='cta-heading']"],
    ];
    for (const [name, sel] of sections) {
      const { result: box } = await cdp.send("Runtime.evaluate", {
        expression: `(() => { const e = document.querySelector(${JSON.stringify(sel)});
          if (!e) return null; const r = e.getBoundingClientRect();
          return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; })()`,
        returnByValue: true,
      });
      if (!box?.value) continue;
      const b = box.value;
      if (b.h < 4 || b.w < 4) continue;
      // shrink tall sections so the PNG stays readable
      const scale = b.h > 1400 ? Math.min(1400 / b.h, 1) : 1;
      const shot = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale },
      });
      const file = `${process.env.SHOTS}/${name}-${w}.png`;
      await fs.writeFile(file, Buffer.from(shot.data, "base64"));
      console.log(`  shot ${name.padEnd(13)} -> ${file}  (${Math.round(b.w)}x${Math.round(b.h)} @${scale.toFixed(2)})`);
    }
  }
}
if (failed) console.log("\n(note: some widths failed to evaluate)");

ws.close();
chrome.kill();
process.exit(0);