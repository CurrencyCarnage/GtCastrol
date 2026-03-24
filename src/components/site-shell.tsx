"use client";

import Link from "next/link";
import { ChevronRight, Globe2, Minus, Plus, ShoppingCart, Trash2, UserCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent } from "react";

import { useCartStore } from "@/store/cart-store";
import { titleFromSlug } from "@/lib/utils";

export function SiteHeader() {
  const count = useCartStore((state) => state.count);
  const isOpen = useCartStore((state) => state.isOpen);
  const toggle = useCartStore((state) => state.toggle);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(5,10,16,0.78)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex flex-col">
              <span className="font-display text-xl uppercase tracking-[0.24em] text-white">
                Castrol Georgia
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Finder, booking, commerce-ready
              </span>
            </Link>
            <nav className="hidden items-center gap-5 lg:flex">
              {[
                ["/products", "Catalogue"],
                ["/finder", "Product Finder"],
                ["/service-centers", "Service Centers"],
                ["/booking", "Booking"],
                ["/blog", "Blog"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-[var(--muted-foreground)] transition hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] md:inline-flex">
              <Globe2 className="h-4 w-4" />
              KA / EN
            </span>
            <Link href="/account" className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.14em] text-white md:inline-flex">
              <UserCircle2 className="h-4 w-4" />
              Account
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-2 text-xs uppercase tracking-[0.14em] text-white transition hover:border-[rgba(164,196,0,0.4)]"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-[var(--brand-contrast)]">{count}</span>
            </button>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-5 pt-4 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] sm:px-8">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" />
              {index === segments.length - 1 ? (
                <span className="text-white">{titleFromSlug(segment)}</span>
              ) : (
                <Link href={href}>{titleFromSlug(segment)}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[rgba(5,10,16,0.9)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-[0.14em] text-white">
            Castrol Georgia
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
            Premium lubricant discovery, service-center booking, and commerce-ready journeys for Georgia.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-[var(--muted-foreground)]">
          {[
            ["/about", "About"],
            ["/contact", "Contact"],
            ["/related-websites", "Related Websites"],
            ["/legal/privacy", "Privacy"],
            ["/legal/terms", "Terms"],
            ["/legal/cookies", "Cookies"],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const count = useCartStore((state) => state.count);
  const close = useCartStore((state) => state.close);
  const clear = useCartStore((state) => state.clear);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const remove = useCartStore((state) => state.remove);

  const handleEscape = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
    }
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(3,7,12,0.6)] backdrop-blur-sm" onClick={close}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(10,18,29,0.98),rgba(5,10,16,0.98))] shadow-[-24px_0_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Cart overview</p>
            <h2 id="cart-drawer-title" className="font-display text-3xl uppercase tracking-[0.12em] text-white">
              Commerce console
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {count} item{count === 1 ? "" : "s"} staged for checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-white/10 p-2 text-[var(--muted-foreground)] transition hover:border-white/20 hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={close}
                        className="font-display text-xl uppercase tracking-[0.08em] text-white"
                      >
                        {item.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        <span className="rounded-full border border-white/10 px-2 py-1">{item.packLabel}</span>
                        <span>{item.priceLabel}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="rounded-full border border-white/10 p-2 text-[var(--muted-foreground)] transition hover:border-[rgba(255,118,118,0.4)] hover:text-[var(--danger)]"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-[var(--muted-foreground)]">Ready for backend pricing and checkout wiring.</p>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1">
                      <button
                        type="button"
                        onClick={() => decrement(item.productId)}
                        className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-white/8 hover:text-white"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increment(item.productId)}
                        className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-white/8 hover:text-white"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/8 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Items staged</span>
                <span className="font-display text-2xl uppercase tracking-[0.08em] text-white">{count}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(122,149,0,0.92)] bg-[linear-gradient(180deg,#bdd629,#94b300)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0a1004] [text-shadow:0_0_0.8px_rgba(7,16,8,0.9),0_1px_0_rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(0,0,0,0.18)]"
                >
                  Continue to catalogue
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)] transition hover:text-white"
                >
                  Clear cart
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col justify-center px-6 py-10">
            <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-black/20 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Cart is empty</p>
              <h3 className="mt-3 font-display text-3xl uppercase tracking-[0.1em] text-white">
                Add products to stage a checkout flow
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
                The drawer is now active. Product cards feed into it, quantities are adjustable, and the surface is ready for real commerce wiring.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(122,149,0,0.92)] bg-[linear-gradient(180deg,#bdd629,#94b300)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0a1004] [text-shadow:0_0_0.8px_rgba(7,16,8,0.9),0_1px_0_rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(0,0,0,0.18)]"
                >
                  Browse catalogue
                </Link>
                <Link
                  href="/finder"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                >
                  Open finder
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
