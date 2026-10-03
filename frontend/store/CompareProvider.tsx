"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { ReactNode } from "react";

/**
 * Compare tray state for products.
 *
 * A small, self-contained context (deliberately NOT part of the Redux store —
 * compare is ephemeral, per-tab UI state with no server persistence, so it has
 * no business in the cached global store).
 *
 * It is mirrored into sessionStorage purely so a refresh on /compare doesn't
 * wipe the user's shortlist. sessionStorage (not localStorage) keeps the state
 * scoped to the tab, matching the "ephemeral" intent.
 */

export interface CompareItem {
  _id: string;
  title: string;
  /** Thumbnail URL; falls back to a placeholder when empty. */
  image?: string;
  /** Optional unit price used on the compare page. */
  price?: number;
  /** Pre-discount price — lets the compare table show a struck-through MRP. */
  originalPrice?: number;
  category?: string;
  /** Slug used to deep-link the compare column back to the product. */
  slug?: string;
}

export const MAX_COMPARE_ITEMS = 4;

/** sessionStorage key for the mirrored tray. */
const STORAGE_KEY = "inkofmemories.compare";

/**
 * Result of a toggle attempt.
 * - `added` / `removed`: the tray changed.
 * - `full`: the cap was already reached, so the tray is untouched. Callers use
 *   this to surface feedback instead of silently doing nothing.
 */
export type ToggleResult = "added" | "removed" | "full";

interface CompareContextValue {
  items: CompareItem[];
  count: number;
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: CompareItem) => ToggleResult;
  isSelected: (id: string) => boolean;
  /** True when the tray is at MAX_COMPARE_ITEMS and can't accept another. */
  isFull: boolean;
  clearAll: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

/** Defensive parse — storage can hold junk from an older shape or a user edit. */
function readStoredItems(): CompareItem[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i): i is CompareItem => !!i && typeof i._id === "string")
      .slice(0, MAX_COMPARE_ITEMS);
  } catch {
    return [];
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   EXTERNAL STORE
   --------------------------------------------------------------------------
   A module-level store read through useSyncExternalStore rather than plain
   useState + useEffect. Two reasons:

   1. Writes happen inside event handlers, so there's no setState-in-effect
      cascade on mount.
   2. The server snapshot is always an empty tray, so the first client render
      matches the server HTML and hydration stays clean. The persisted tray is
      swapped in on the store's first client subscription.
   ══════════════════════════════════════════════════════════════════════════ */

type Listener = () => void;

/** Stable empty identity — the server snapshot must not change between calls. */
const EMPTY: CompareItem[] = [];

let store: CompareItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<Listener>();

/** Writes the new snapshot and wakes every subscriber. */
function commit(next: CompareItem[]) {
  store = next;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota — the tray still works for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener): () => void {
  // Lazy hydration on the first subscriber rather than at module scope, so the
  // server bundle never touches sessionStorage.
  if (!hydrated) {
    hydrated = true;
    store = readStoredItems();
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => store;
const getServerSnapshot = () => EMPTY;

/** True once the client has read the persisted tray (used to skip persistence). */
const hasHydrated = () => hydrated;

export function CompareProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((item: CompareItem) => {
    // Read the live store, not a render-time closure — several cards can be
    // clicked before React re-renders.
    const current = hasHydrated() ? store : EMPTY;
    if (current.some((i) => i._id === item._id)) return;
    // Cap the tray — the compare table is only readable up to 4 columns.
    if (current.length >= MAX_COMPARE_ITEMS) return;
    commit([...current, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    const current = hasHydrated() ? store : EMPTY;
    if (!current.some((i) => i._id === id)) return;
    commit(current.filter((i) => i._id !== id));
  }, []);

  const toggleItem = useCallback((item: CompareItem): ToggleResult => {
    const current = hasHydrated() ? store : EMPTY;

    if (current.some((i) => i._id === item._id)) {
      commit(current.filter((i) => i._id !== item._id));
      return "removed";
    }
    if (current.length >= MAX_COMPARE_ITEMS) return "full";

    commit([...current, item]);
    return "added";
  }, []);

  const isSelected = useCallback(
    (id: string) => items.some((i) => i._id === id),
    [items],
  );

  const clearAll = useCallback(() => {
    if (!store.length) return;
    commit(EMPTY);
  }, []);

  const value = useMemo<CompareContextValue>(
    () => ({
      items,
      count: items.length,
      addItem,
      removeItem,
      toggleItem,
      isSelected,
      isFull: items.length >= MAX_COMPARE_ITEMS,
      clearAll,
    }),
    [items, addItem, removeItem, toggleItem, isSelected, clearAll],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

/**
 * Access the compare tray. Throws when used outside <CompareProvider> so the
 * mistake surfaces immediately in development instead of silently no-oping.
 */
export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a <CompareProvider>");
  }
  return ctx;
}