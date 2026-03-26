"use client";

import Link from "next/link";
import { ChevronRight, Globe2, Menu, Minus, Plus, ShoppingCart, Trash2, UserCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";

import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import { useCartStore } from "@/store/cart-store";
import { titleFromSlug } from "@/lib/utils";

export function SiteHeader() {
  const count = useCartStore((state) => state.count);
  const isOpen = useCartStore((state) => state.isOpen);
  const toggle = useCartStore((state) => state.toggle);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    ["/products", "Catalogue"],
    ["/finder", "Product Finder"],
    ["/service-centers", "Service Centers"],
    ["/booking", "Booking"],
    ["/blog", "Blog"],
  ] as const;

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[rgba(0,91,42,0.12)] bg-[rgba(249,252,246,0.92)] backdrop-blur-2xl shadow-[0_10px_30px_rgba(12,52,30,0.06)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3 lg:gap-8">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isMenuOpen}
              aria-label="Open navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(0,91,42,0.14)] bg-white text-[var(--foreground)] shadow-[0_8px_18px_rgba(12,52,30,0.06)] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex min-w-0 flex-col">
              <span className="truncate font-display text-lg uppercase tracking-[0.22em] text-[var(--foreground)] sm:text-xl">
                Castrol Georgia
              </span>
              <span className="truncate text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)] sm:text-xs sm:tracking-[0.2em]">
                Product, service, branch journeys
              </span>
            </Link>
            <nav className="hidden items-center gap-5 lg:flex">
              {navLinks.map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-[rgba(0,91,42,0.14)] bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] md:inline-flex">
              <Globe2 className="h-4 w-4" />
              KA / EN
            </span>
            <Link href="/account" className="hidden items-center gap-2 rounded-full border border-[rgba(0,91,42,0.14)] bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] md:inline-flex">
              <UserCircle2 className="h-4 w-4" />
              Account
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                toggle();
              }}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,91,42,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(241,247,238,1))] px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] transition hover:border-[rgba(0,133,63,0.34)]"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-[var(--brand-contrast)]">{count}</span>
            </button>
          </div>
        </div>
      </header>
      <MobileNavDrawer isOpen={isMenuOpen} close={() => setIsMenuOpen(false)} navLinks={navLinks} />
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
                <span className="text-[var(--foreground)]">{titleFromSlug(segment)}</span>
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
    <footer className="border-t border-[rgba(0,91,42,0.12)] bg-[rgba(255,255,255,0.88)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-[0.14em] text-[var(--foreground)]">
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

function MobileNavDrawer({
  isOpen,
  close,
  navLinks,
}: {
  isOpen: boolean;
  close: () => void;
  navLinks: readonly (readonly [string, string])[];
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[45] flex bg-[rgba(9,34,19,0.18)] backdrop-blur-sm" onClick={close}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="flex h-full w-full max-w-[20rem] flex-col border-r border-[rgba(0,91,42,0.14)] bg-[linear-gradient(180deg,rgba(250,252,247,0.99),rgba(240,247,235,0.99))] shadow-[24px_0_80px_rgba(12,52,30,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[rgba(0,91,42,0.1)] px-5 py-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Navigation</p>
            <h2 className="font-display text-3xl uppercase tracking-[0.12em] text-[var(--foreground)]">
              Castrol Georgia
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">Browse the core product, service, and content sections.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-[rgba(0,91,42,0.14)] p-2 text-[var(--muted-foreground)] transition hover:border-[rgba(0,133,63,0.3)] hover:text-[var(--foreground)]"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="grid gap-2 px-4 py-5">
          {navLinks.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="rounded-[1.2rem] border border-[rgba(0,91,42,0.1)] bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] shadow-[0_10px_24px_rgba(12,52,30,0.05)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-[rgba(0,91,42,0.1)] px-4 py-5">
          <Link
            href="/account"
            onClick={close}
            className="flex items-center gap-3 rounded-[1.2rem] border border-[rgba(0,91,42,0.1)] bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] shadow-[0_10px_24px_rgba(12,52,30,0.05)]"
          >
            <UserCircle2 className="h-4 w-4" />
            Account
          </Link>
          <div className="flex items-center gap-3 rounded-[1.2rem] border border-[rgba(0,91,42,0.1)] bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)] shadow-[0_10px_24px_rgba(12,52,30,0.05)]">
            <Globe2 className="h-4 w-4" />
            KA / EN
          </div>
        </div>
      </aside>
    </div>
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
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

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
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(9,34,19,0.18)] backdrop-blur-sm" onClick={close}>
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="flex h-full w-full max-w-xl flex-col border-l border-[rgba(0,91,42,0.14)] bg-[linear-gradient(180deg,rgba(250,252,247,0.99),rgba(240,247,235,0.99))] shadow-[-24px_0_80px_rgba(12,52,30,0.12)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-[rgba(0,91,42,0.1)] px-6 py-5">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Cart overview</p>
              <h2 id="cart-drawer-title" className="font-display text-3xl uppercase tracking-[0.12em] text-[var(--foreground)]">
                Commerce console
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                {count} item{count === 1 ? "" : "s"} staged for checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-[rgba(0,91,42,0.14)] p-2 text-[var(--muted-foreground)] transition hover:border-[rgba(0,133,63,0.3)] hover:text-[var(--foreground)]"
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
                    className="rounded-[1.5rem] border border-[rgba(0,91,42,0.12)] bg-white p-4 shadow-[0_14px_28px_rgba(12,52,30,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={close}
                          className="font-display text-xl uppercase tracking-[0.08em] text-[var(--foreground)]"
                        >
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                          <span className="rounded-full border border-[rgba(0,91,42,0.14)] px-2 py-1">{item.packLabel}</span>
                          <span>{item.priceLabel}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        className="rounded-full border border-[rgba(0,91,42,0.14)] p-2 text-[var(--muted-foreground)] transition hover:border-[rgba(191,44,57,0.24)] hover:text-[var(--danger)]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-[var(--muted-foreground)]">Ready for backend pricing and checkout wiring.</p>
                      <div className="flex items-center gap-2 rounded-full border border-[rgba(0,91,42,0.12)] bg-[rgba(220,235,216,0.72)] p-1">
                        <button
                          type="button"
                          onClick={() => decrement(item.productId)}
                          className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--foreground)]"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-[var(--foreground)]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increment(item.productId)}
                          className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--foreground)]"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-[rgba(0,91,42,0.1)] px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Items staged</span>
                  <span className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--foreground)]">{count}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setIsComingSoonOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(0,91,42,0.9)] bg-[linear-gradient(180deg,#0aa24b,#007a37)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_28px_rgba(0,122,55,0.2)]"
                  >
                    Buy online
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(0,91,42,0.14)] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] transition hover:border-[rgba(0,133,63,0.3)]"
                  >
                    Clear cart
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col justify-center px-6 py-10">
              <div className="rounded-[1.75rem] border border-dashed border-[rgba(0,91,42,0.18)] bg-white p-6 shadow-[0_14px_32px_rgba(12,52,30,0.06)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Cart is empty</p>
                <h3 className="mt-3 font-display text-3xl uppercase tracking-[0.1em] text-[var(--foreground)]">
                  Add products to stage a checkout flow
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
                  The drawer is now active. Product cards feed into it, quantities are adjustable, and the surface is ready for real commerce wiring.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    onClick={close}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(0,91,42,0.9)] bg-[linear-gradient(180deg,#0aa24b,#007a37)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_28px_rgba(0,122,55,0.2)]"
                  >
                    Browse catalogue
                  </Link>
                  <Link
                    href="/finder"
                    onClick={close}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(0,91,42,0.14)] bg-[rgba(255,255,255,0.9)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]"
                  >
                    Open finder
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
      <ComingSoonDialog
        open={isComingSoonOpen}
        close={() => setIsComingSoonOpen(false)}
        title="Online checkout"
        description="Checkout is not live yet. The cart is wired for product staging and quantity changes, and online purchasing will be enabled in a later release."
      />
    </>
  );
}
