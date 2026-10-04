"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Check, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/contexts/CartContext";
import { selectIsAuthenticated } from "@/store/authSlice";
import { cn } from "@/lib/utils";

/**
 * Circular quick-add control for product cards.
 *
 * Sits in the same top-right rail as the shared <Heart> wishlist button and
 * <CompareToggle>, and deliberately reuses their glassy circular shell so the
 * three read as one set of card affordances.
 *
 * Behaviour notes
 * - The cart routes are `protect`-ed, so an anonymous click is bounced to
 *   /auth (matching what <Heart> does) instead of firing a doomed request.
 * - Quantity defaults to the product's minimum order quantity, which is the
 *   unit the storefront prices against. Options/customization are left off —
 *   the card has no picker for them, so those are chosen on the detail page.
 * - The transient "added" check reverts on its own timer; it is a confirmation
 *   of the last click, not a persistent "is in cart" flag, because the same
 *   product can legitimately be added again.
 */
export default function AddToCartButton({
  item,
  className,
}: {
  item: {
    /** Product _id — the backend keys cart lines off this. */
    id: string;
    name: string;
    /** Unit price to store on the cart line (already discounted by the caller). */
    price: number;
    /** Fallback artwork; the cart ignores it, the API populates images itself. */
    image?: string;
    /** Minimum order quantity. Falls back to 1 for products without one. */
    minQuantity?: number;
    /** Hide/disable the control when the product can't be bought. */
    stock?: number;
  };
  className?: string;
}) {
  const { addItem } = useCart();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  // Cleared on unmount so a card scrolled out of view mid-animation can't set
  // state on a dead component.
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const quantity =
    typeof item.minQuantity === "number" && item.minQuantity > 0
      ? item.minQuantity
      : 1;

  const outOfStock = typeof item.stock === "number" && item.stock <= 0;
  const busy = status === "adding";

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Cards nest the tile in links in some layouts and the featured carousel
    // stops drag-initiated clicks via capture — don't let either swallow this.
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock || busy) return;

    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      router.push("/auth");
      return;
    }

    setStatus("adding");

    // addItem toasts the failure reason itself; gate our success toast on it.
    const ok = await addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image ?? "",
    });

    if (!ok) {
      setStatus("idle");
      return;
    }

    setStatus("added");
    toast.success("Added to cart!", {
      description: `${item.name} (${quantity} pcs) added.`,
    });

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 1600);
  };

  const label = outOfStock
    ? `${item.name} is out of stock`
    : `Add ${item.name} to cart`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock || busy}
      aria-busy={busy}
      aria-label={label}
      title={outOfStock ? "Out of stock" : "Add to cart"}
      className={cn(
        "group/cart inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-brand dark:focus-visible:ring-offset-footer",
        "motion-reduce:transition-none",
        outOfStock
          ? "cursor-not-allowed border-border bg-card/40 text-muted-foreground/40"
          : status === "added"
            ? "scale-105 border-brand bg-brand text-primary-foreground"
            : "border-border bg-card/60 text-muted-foreground hover:scale-105 hover:border-brand hover:bg-card/80 hover:text-foreground dark:border-brand dark:bg-card/60 dark:text-muted-foreground dark:hover:border-border dark:hover:text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {busy ? (
        <Loader2
          aria-hidden="true"
          size={18}
          className="animate-spin"
        />
      ) : status === "added" ? (
        <Check
          aria-hidden="true"
          size={18}
          strokeWidth={2.6}
          className="transition-transform duration-300 group-hover/cart:scale-110"
        />
      ) : (
        <ShoppingBag
          aria-hidden="true"
          size={18}
          strokeWidth={2}
          className="transition-transform duration-300 group-hover/cart:-translate-y-0.5 group-hover/cart:scale-110"
        />
      )}
    </button>
  );
}