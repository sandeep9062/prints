"use client";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customization?: {
    size?: string;
    paperType?: string;
    colorTheme?: string;
  };
}

const Cart = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
  }: {
    items: CartItem[];
    removeItem: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    totalPrice: number;
  } = useCart();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Cart", url: "/cart" },
  ]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHelper
          title="Shopping Cart"
          description="Your shopping cart is empty. Browse our premium printing products – wedding cards, visiting cards, brochures & more."
          path="/cart"
          image="https://inkofmemories.com/inkofmemories.png"
          keywords="shopping cart, printing products cart, Ink of Memories cart"
          jsonLd={breadcrumbSchema}
        />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>

              <h1 className="font-display text-2xl font-semibold mb-4">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>

              <Link href="/products">
                <Button variant="gold" size="lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Shopping Cart"
        description="Review your printing order. Wedding cards, visiting cards, brochures & more in your customized cart from Samlason Printing Press."
        path="/cart"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="shopping cart, printing products cart, Ink of Memories cart, order review"
        jsonLd={breadcrumbSchema}
      />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">
            Shopping Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card-elegant p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-lg font-medium mb-1">
                        {item.name}
                      </h3>

                      {item.customization && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.customization.size} •{" "}
                          {item.customization.paperType} •{" "}
                          {item.customization.colorTheme}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload Files */}
              <div className="card-elegant p-6">
                <h3 className="font-display text-lg font-medium mb-4">
                  Upload Design Files
                </h3>

                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload your designs, logos, or reference images
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports: PDF, PNG, JPG, AI, PSD (Max 50MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-elegant p-6 sticky top-28">
                <h3 className="font-display text-xl font-semibold mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Promo Code
                  </label>

                  <div className="flex gap-2">
                    <Input placeholder="Enter code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <Button variant="gold" size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout powered by industry-standard encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
