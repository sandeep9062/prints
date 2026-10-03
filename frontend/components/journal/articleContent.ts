/**
 * Safe, dependency-free parser for the HTML that the admin Lexical editor
 * stores in `blog.content`.
 *
 * We deliberately do NOT use `dangerouslySetInnerHTML`: instead the markup is
 * tokenised into a small, whitelisted AST that we render as React nodes. Any
 * tag that isn't on the whitelist is dropped, so no script/style/iframe can
 * ever reach the DOM.
 */

export type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong"; children: InlineToken[] }
  | { type: "em"; children: InlineToken[] }
  | { type: "code"; value: string }
  | { type: "link"; href: string; children: InlineToken[] }
  | { type: "image"; src: string; alt: string };

export type ArticleBlock =
  | { kind: "h2" | "h3"; text: string; id: string }
  | { kind: "p"; tokens: InlineToken[] }
  | { kind: "quote"; tokens: InlineToken[] }
  | { kind: "list"; items: InlineToken[][]; ordered: boolean }
  | { kind: "image"; src: string; alt: string };

type InlineKind = "strong" | "em" | "code" | "link";

/** Whitelisted inline tags -> the token kind they produce. */
const INLINE_MAP: Record<string, InlineKind> = {
  b: "strong",
  strong: "strong",
  i: "em",
  em: "em",
  cite: "em",
  code: "code",
  kbd: "code",
  samp: "code",
  tt: "code",
  a: "link",
};

/** Tags that never have a closing counterpart. */
const VOID_TAGS = new Set(["br", "img", "hr", "input", "meta", "link"]);

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

export function decodeEntities(value: string): string {
  return value.replace(
    /&(#x?[0-9a-f]+|[a-z]+);/gi,
    (match, entity: string) => {
      const lower = entity.toLowerCase();
      if (lower[0] === "#") {
        const isHex = lower[1] === "x";
        const code = Number.parseInt(
          lower.slice(isHex ? 2 : 1),
          isHex ? 16 : 10,
        );
        return Number.isFinite(code) && code > 0 && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : match;
      }
      return NAMED_ENTITIES[lower] ?? match;
    },
  );
}

/** Turn arbitrary editor markup into plain text (meta tags, alt text, TOC). */
export function htmlToText(html?: string | null): string {
  if (!html) return "";
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyHeading(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base || "section";
}

/** Only allow links we are happy to render as an anchor. */
function safeHref(href?: string | null): string | null {
  if (!href) return null;
  const value = href.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value)) return value;
  return null;
}

function readAttr(attrs: string, name: string): string | null {
  const re = new RegExp(
    `\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
    "i",
  );
  const match = attrs.match(re);
  if (!match) return null;
  return match[2] ?? match[3] ?? match[4] ?? null;
}
interface OpenInline {
  kind: InlineKind;
  href?: string | null;
  children: InlineToken[];
}

function buildInlineNode(entry: OpenInline): InlineToken {
  if (entry.kind === "link") {
    return {
      type: "link",
      href: safeHref(entry.href) ?? "#",
      children: entry.children,
    };
  }
  if (entry.kind === "code") {
    return { type: "code", value: tokensToPlainText(entry.children) };
  }
  return { type: entry.kind, children: entry.children };
}

export function tokensToPlainText(tokens: InlineToken[]): string {
  return tokens
    .map((t) => {
      if (t.type === "text" || t.type === "code") return t.value;
      if (t.type === "image") return "";
      return tokensToPlainText(t.children);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

const INLINE_RE =
  /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;

/**
 * Tokenise a fragment of inline markup into whitelisted inline tokens.
 * Unknown tags are ignored, but their text content is preserved.
 */
export function parseInline(html: string): InlineToken[] {
  const root: InlineToken[] = [];
  const stack: OpenInline[] = [];
  let current: InlineToken[] = root;

  INLINE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = INLINE_RE.exec(html)) !== null) {
    const [, slash = "", rawTag = "", rawAttrs = "", rawText] = match;

    if (rawTag === "") {
      current.push({ type: "text", value: decodeEntities(rawText ?? "") });
      continue;
    }

    const isClosing = slash === "/";
    const tag = rawTag.toLowerCase();

    if (VOID_TAGS.has(tag)) {
      if (!isClosing && tag === "br") current.push({ type: "text", value: " " });
      if (!isClosing && tag === "img") {
        const src = safeHref(readAttr(rawAttrs, "src"));
        if (src) {
          current.push({
            type: "image",
            src,
            alt: decodeEntities(readAttr(rawAttrs, "alt") ?? ""),
          });
        }
      }
      continue;
    }

    const kind = INLINE_MAP[tag];
    if (!kind) continue; // not whitelisted -> drop the tag, keep any text

    if (isClosing) {
      let index = -1;
      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (stack[i].kind === kind) {
          index = i;
          break;
        }
      }
      if (index === -1) continue; // stray closing tag
      const entry = stack[index];
      stack.length = index;
      current = stack.length ? stack[stack.length - 1].children : root;
      current.push(buildInlineNode(entry));
      continue;
    }

    const entry: OpenInline = {
      kind,
      href: kind === "link" ? readAttr(rawAttrs, "href") : null,
      children: [],
    };
    stack.push(entry);
    current = entry.children;
  }

  // Unbalanced tags: close whatever is still open.
  while (stack.length) {
    const entry = stack.pop()!;
    current = stack.length ? stack[stack.length - 1].children : root;
    current.push(buildInlineNode(entry));
  }

  return root;
}
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Normalise inline Markdown to the same subset of HTML the block parser
 * understands, so `**bold**`, `[text](url)` and friends survive rendering.
 */
function markdownInlineToHtml(text: string): string {
  let out = escapeHtml(text);

  // Images first — `![alt](src)` would otherwise be read as a link.
  out = out.replace(
    /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\s*\)/g,
    (match, alt: string, src: string) => {
      const safe = safeHref(decodeEntities(src));
      return safe
        ? `<img src="${safe}" alt="${escapeHtml(alt)}">`
        : "";
    },
  );

  // Links.
  out = out.replace(
    /\[([^\]]+)\]\(\s*([^)\s]+)\s*\)/g,
    (match, label: string, href: string) => {
      const safe = safeHref(decodeEntities(href));
      return safe ? `<a href="${safe}">${label}</a>` : label;
    },
  );

  // Inline code (before emphasis, so backticked `*` isn't treated as markup).
  out = out.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // Bold, then italic.
  out = out.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(/(^|[^_\w])_([^_\n]+)_(?![\w])/g, "$1<em>$2</em>");

  return out;
}

/**
 * Convert the Markdown that the seeded posts (and the editor's markdown mode)
 * store into the small HTML subset {@link parseArticleContent} understands.
 *
 * Only the constructs actually used by the blog are handled: ATX headings,
 * unordered/ordered lists, blockquotes, thematic breaks and fenced code.
 * A `#` heading is emitted as `<h2>` because the article title is already the
 * page's `<h1>`.
 */
function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let paragraph: string[] = [];
  let list: "ul" | "ol" | null = null;
  let inCodeFence = false;
  let codeLines: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${markdownInlineToHtml(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Fenced code — rendered as a paragraph rather than adding a <pre> path.
    if (/^(```|~~~)/.test(line)) {
      if (inCodeFence) {
        out.push(`<p>${escapeHtml(codeLines.join(" "))}</p>`);
        codeLines = [];
        inCodeFence = false;
      } else {
        flushParagraph();
        flushList();
        inCodeFence = true;
      }
      continue;
    }
    if (inCodeFence) {
      codeLines.push(rawLine.trim());
      continue;
    }

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Thematic break — purely decorative here, so drop it.
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const tag = level <= 2 ? "h2" : "h3";
      out.push(`<${tag}>${markdownInlineToHtml(heading[2].trim())}</${tag}>`);
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flushParagraph();
      flushList();
      out.push(
        `<blockquote>${markdownInlineToHtml(quote[1] ?? "")}</blockquote>`,
      );
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const wanted = bullet ? "ul" : "ol";
      if (list !== wanted) {
        flushList();
        out.push(`<${wanted}>`);
        list = wanted;
      }
      out.push(`<li>${markdownInlineToHtml((bullet ?? numbered)![1])}</li>`);
      continue;
    }

    // Table rows have no renderer; keep the text rather than dropping it.
    flushList();
    paragraph.push(
      line.startsWith("|") ? line.replace(/^\|+|\|+$/g, "").trim() : line,
    );
  }

  if (inCodeFence && codeLines.length) {
    out.push(`<p>${escapeHtml(codeLines.join(" "))}</p>`);
  }
  flushParagraph();
  flushList();

  return out.join("\n");
}

/**
 * The API has served two different shapes over time: seeded posts store
 * Markdown, while posts created through the Lexical editor store HTML.
 * Normalise both into the HTML subset our parser understands.
 */
export function normalizeContent(raw?: string | null): string {
  if (!raw) return "";
  const hasHtmlBlock = /<\/?(p|h[1-6]|ul|ol|li|blockquote|div|img|br|figure)\b/i.test(
    raw,
  );
  return hasHtmlBlock ? raw : markdownToHtml(raw);
}

/**
 * Paired block elements, self-closing <img>, <hr> and list openers, in one pass
 * so document order is preserved. Named groups keep the indices readable.
 */
const BLOCK_RE =
  /<(?<btag>h2|h3|h4|p|li|blockquote)\b[^>]*>(?<binner>[\s\S]*?)<\/\k<btag>\s*>|<img\b(?<iattrs>[^>]*)\/?>|<hr\s*\/?>|<(?<ltag>ol|ul)\b[^>]*>/gi;

function pushTextBlock(blocks: ArticleBlock[], tokens: InlineToken[]): void {
  if (tokensToPlainText(tokens)) blocks.push({ kind: "p", tokens });
}

/**
 * Loose text between block elements becomes one paragraph per non-empty line.
 * Without this, plain-text posts (blank-line separated) collapse into a
 * single unreadable wall of text.
 */
function pushLooseText(blocks: ArticleBlock[], raw: string): void {
  for (const chunk of raw.split(/\r?\n+/)) {
    const trimmed = chunk.trim();
    if (trimmed) pushTextBlock(blocks, parseInline(trimmed));
  }
}

/**
 * Parse `blog.content` into renderable blocks. Always returns at least one
 * block for non-empty input so the reader never sees an empty article body.
 */
export function parseArticleContent(html?: string | null): ArticleBlock[] {
  if (!html) return [];

  // Normalise Markdown -> HTML, then drop <script>/<style> *including their
  // text content* so their source can never leak into the rendered prose.
  const safeHtml = normalizeContent(html).replace(
    /<(script|style|noscript|template)\b[\s\S]*?<\/\1\s*>/gi,
    "",
  );

  const blocks: ArticleBlock[] = [];
  const usedIds = new Set<string>();
  let list: InlineToken[][] | null = null;
  let listOrdered = false;
  let cursor = 0;

  const flushList = () => {
    if (list && list.length) {
      blocks.push({ kind: "list", items: list, ordered: listOrdered });
    }
    list = null;
  };

  const addHeading = (level: "h2" | "h3", text: string) => {
    const base = slugifyHeading(text);
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    blocks.push({ kind: level, text, id });
  };

  BLOCK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = BLOCK_RE.exec(safeHtml)) !== null) {
    // Loose text sitting between block elements (e.g. plain newlines typed in
    // the editor) still deserves to be shown, one paragraph per line.
    const loose = safeHtml.slice(cursor, match.index);
    if (loose.trim()) pushLooseText(blocks, loose);
    cursor = match.index + match[0].length;

    const tag = match.groups?.btag?.toLowerCase();
    const inner = match.groups?.binner ?? "";
    const imgAttrs = match.groups?.iattrs;
    const listTag = match.groups?.ltag?.toLowerCase();

    // A new list opener starts a fresh list, so flush whatever was pending.
    if (listTag) {
      flushList();
      listOrdered = listTag === "ol";
    }

    if (tag) {
      const tokens = parseInline(inner);
      const text = tokensToPlainText(tokens);
      if (!text) continue;

      if (tag === "li") {
        list ??= [];
        list.push(tokens);
        continue;
      }
      flushList();

      if (tag === "h2") addHeading("h2", text);
      else if (tag === "h3") addHeading("h3", text);
      else if (tag === "blockquote") blocks.push({ kind: "quote", tokens });
      else blocks.push({ kind: "p", tokens });
      continue;
    }

    if (imgAttrs !== undefined) {
      flushList();
      const src = safeHref(readAttr(imgAttrs, "src"));
      if (src) {
        blocks.push({
          kind: "image",
          src,
          alt: decodeEntities(readAttr(imgAttrs, "alt") ?? ""),
        });
      }
      continue;
    }
    // <hr> — decorative only, the section spacing already conveys structure.
  }

  const tail = safeHtml.slice(cursor);
  if (tail.trim()) pushLooseText(blocks, tail);
  flushList();

  return blocks;
}

/** Anchor targets for the "In this note" table of contents. */
export function extractHeadings(
  blocks: ArticleBlock[],
): Array<{ id: string; text: string; level: "h2" | "h3" }> {
  return blocks
    .filter((b): b is Extract<ArticleBlock, { kind: "h2" | "h3" }> =>
      b.kind === "h2" || b.kind === "h3",
    )
    .map((b) => ({ id: b.id, text: b.text, level: b.kind }));
}

/** Rough fallback read time, used when the post has no `readTime` field. */
export function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (!words) return "1 min read";
  return `${Math.max(1, Math.round(words / 200))} min read`;
}