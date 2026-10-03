"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

/*
  Navbar search field.

  Design notes
  - Palette matches the Navbar: bone field on sage, bottle-green ink (#1F3A32)
    text, and the foil-gold accent (#B08D4A / #D2AE62 on dark) for the leading
    icon and focus ring.
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
        "flex h-10 w-full items-center gap-2 rounded-full border border-[#1F3A32]/20 bg-[#F7F4EE]/80 pl-4 pr-2 transition-colors focus-within:border-[#B08D4A] focus-within:ring-2 focus-within:ring-[#B08D4A]/40 dark:border-[#E4E9DD]/20 dark:bg-white/5 dark:focus-within:border-[#D2AE62] dark:focus-within:ring-[#D2AE62]/30",
        className,
      )}
    >
      <Search
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-[#B08D4A] dark:text-[#D2AE62]"
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
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1F3A32] outline-none placeholder:text-[#1F3A32]/50 dark:text-[#F7F4EE] dark:placeholder:text-[#E4E9DD]/50 [&::-webkit-search-cancel-button]:hidden"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#1F3A32]/50 transition-colors hover:bg-[#1F3A32]/10 hover:text-[#1F3A32] motion-reduce:transition-none dark:text-[#E4E9DD]/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
export { SearchBar };