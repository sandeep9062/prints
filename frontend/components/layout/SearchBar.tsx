"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

/*
  Navbar search field.

  Design notes
  - Palette matches the Navbar: a cool off-white field on the bar, ink navy text
    (--foreground), and the foil-gold accent (--gold on navy, --gold-text on
    paper) for the leading icon and focus ring.
  - The field outline is `border-foreground/50`, not `border`: against the white
    bar `border` measures only 1.24:1 and `border-border/20` just 1.04:1, so the
    search box had no visible edge at all. 50% ink clears the 3:1 that WCAG
    1.4.11 asks for on a control boundary.
  - Submitting jumps to the catalogue (`/products`) with the term written under
    `?search=`, which ProductsListClient reads back. Pass `onSearch` to run a
    local filter instead, or `params` to carry context (such as the active
    category) into the results URL.
  - The input owns its own value, so the field keeps what was typed as the
    route changes; nothing has to be lifted into the Navbar.
*/

export interface SearchBarProps {
  /** Base path the term is sent to. Defaults to the product catalogue. */
  action?: string;
  /** Query-string key the term is stored under. */
  paramName?: string;
  /** Extra params carried into the URL, e.g. the active category. */
  params?: Record<string, string | undefined>;
  /** When provided, the handler owns submission and no route change happens. */
  onSearch?: (query: string) => void;
  /** Seed value, e.g. a term already present in the URL. */
  defaultQuery?: string;
  placeholder?: string;
  id?: string;
  className?: string;
}

const SearchBar = ({
  action = "/products",
  paramName = "search",
  params,
  onSearch,
  defaultQuery = "",
  placeholder = "Search cards & stationery…",
  id,
  className,
}: SearchBarProps) => {
  const router = useRouter();
  const reactId = useId();
  const inputId = id ?? `search-${reactId}`;
  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();

    if (onSearch) {
      onSearch(term);
      return;
    }

    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value) next.set(key, value);
    }
    if (term) next.set(paramName, term);

    const qs = next.toString();
    router.push(qs ? `${action}?${qs}` : action);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-full border border-foreground/50 bg-muted pl-4 pr-2 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/40 dark:focus-within:border-gold dark:focus-within:ring-gold/30",
        className,
      )}
    >
      <Search
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-gold-text dark:text-gold"
      />

      <label htmlFor={inputId} className="sr-only">
        Search
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground motion-reduce:transition-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
export { SearchBar };