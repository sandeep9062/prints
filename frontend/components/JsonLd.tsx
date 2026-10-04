type JsonLdItem = Record<string, unknown>;

/**
 * Renders schema.org JSON-LD into the server-rendered HTML.
 *
 * <SEOHelper> injects JSON-LD from a useEffect, so anything relying on it is
 * invisible to crawlers and social scrapers that never execute JavaScript.
 * Pages that export Next `metadata` should render their structured data with
 * this component instead, so it ships inside the initial HTML payload.
 *
 * Deliberately NOT a "use client" module — importing it from a client component
 * would push it back across the client boundary and defeat the purpose.
 *
 * Each item renders its own <script> so several blocks can coexist on a page.
 */
export function JsonLd({ items }: { items: JsonLdItem | JsonLdItem[] }) {
  const list = Array.isArray(items) ? items : [items];

  return (
    <>
      {list.map((item, index) => (
        <script
          key={
            typeof item["@type"] === "string"
              ? `${item["@type"]}-${index}`
              : `jsonld-${index}`
          }
          type="application/ld+json"
          // `<` is escaped so a string value can never terminate the script
          // element early (XSS-safe JSON-LD embedding).
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}