"use client";

import { useEffect } from "react";
import { SITE_CONFIG, generatePageMeta, type SEOPageProps } from "@/lib/seo";

/**
 * SEOHelper – Injects meta tags, Open Graph, Twitter Cards,
 * canonical URL, and JSON-LD structured data into <head>.
 *
 * Use on every "use client" page that cannot use Next.js `generateMetadata`.
 */
type JsonLdItem = Record<string, any>;

export function SEOHelper(
  props: SEOPageProps & { jsonLd?: JsonLdItem | JsonLdItem[] },
) {
  const { jsonLd, ...metaProps } = props;

  useEffect(() => {
    const meta = generatePageMeta(metaProps);
    const head = document.head;
    const fragments: HTMLStyleElement[] = [];

    // ── Helper to set / update a <meta> tag ──
    function setMeta(name: string, content: string, attrKey = "name") {
      let el = head.querySelector(
        `meta[${attrKey}="${name}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrKey, name);
        head.appendChild(el);
        fragments.push(el as any);
      }
      el.content = content;
    }

    // ── Title ──
    const title = meta.title as string;
    document.title = title;

    // ── Standard meta ──
    if (meta.description) setMeta("description", meta.description as string);
    if (meta.keywords) setMeta("keywords", meta.keywords as string);

    // ── Robots ──
    const robots = meta.robots as any;
    if (robots) {
      const directives = [];
      if (robots.index === false) directives.push("noindex");
      else directives.push("index");
      if (robots.follow === false) directives.push("nofollow");
      else directives.push("follow");
      if (robots.googleBot?.["max-image-preview"] === "large")
        directives.push("max-image-preview:large");
      if (robots.googleBot?.["max-snippet"] === -1)
        directives.push("max-snippet:-1");
      if (robots.googleBot?.["max-video-preview"] === -1)
        directives.push("max-video-preview:-1");
      setMeta("robots", directives.join(", "));
    }

    // ── Canonical ──
    const alternates = meta.alternates as any;
    if (alternates?.canonical) {
      let link = head.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        head.appendChild(link);
        fragments.push(link as any);
      }
      link.href = alternates.canonical;
    }

    // ── Open Graph ──
    const og = meta.openGraph as any;
    if (og) {
      setMeta("og:title", og.title, "property");
      setMeta("og:description", og.description, "property");
      setMeta("og:url", og.url, "property");
      setMeta("og:site_name", og.siteName, "property");
      setMeta("og:locale", og.locale, "property");
      setMeta("og:type", og.type, "property");
      if (og.images?.[0]?.url) {
        setMeta("og:image", og.images[0].url, "property");
        setMeta(
          "og:image:width",
          String(og.images[0].width || 1200),
          "property",
        );
        setMeta(
          "og:image:height",
          String(og.images[0].height || 630),
          "property",
        );
        setMeta("og:image:alt", og.images[0].alt || title, "property");
      }
      if (og.article?.publishedTime) {
        setMeta("article:published_time", og.article.publishedTime, "property");
      }
      if (og.article?.authors?.length) {
        setMeta("article:author", og.article.authors[0], "property");
      }
    }

    // ── Twitter Card ──
    const tw = meta.twitter as any;
    if (tw) {
      setMeta("twitter:card", tw.card);
      setMeta("twitter:title", tw.title);
      setMeta("twitter:description", tw.description);
      setMeta("twitter:image", tw.images?.[0]);
      if (tw.creator) setMeta("twitter:creator", tw.creator);
    }

    // ── Geo / Business tags ──
    const other = meta.other as Record<string, string> | undefined;
    if (other) {
      Object.entries(other).forEach(([name, content]) => {
        setMeta(name, content, "name");
      });
    }

    // ── JSON-LD Structured Data ──
    if (jsonLd) {
      const scriptId = "__seo_jsonld__";
      let script = document.getElementById(
        scriptId,
      ) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        head.appendChild(script);
        fragments.push(script as any);
      }
      // Support both single object and array of JSON-LD blocks
      const ldContent = Array.isArray(jsonLd)
        ? jsonLd.map((item) => JSON.stringify(item)).join("\n")
        : JSON.stringify(jsonLd);
      script.textContent = ldContent;
    }

    // Cleanup on unmount
    return () => {
      fragments.forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    metaProps.title,
    metaProps.description,
    metaProps.canonical,
    metaProps.image,
    metaProps.path,
    metaProps.keywords,
    metaProps.noIndex,
    metaProps.publishedTime,
    metaProps.author,
    metaProps.type,
    jsonLd
      ? Array.isArray(jsonLd)
        ? jsonLd.map((i) => JSON.stringify(i)).join(",")
        : JSON.stringify(jsonLd)
      : null,
  ]);

  return null;
}
