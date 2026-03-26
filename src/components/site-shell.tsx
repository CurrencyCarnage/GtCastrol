"use client";

import Link from "next/link";
import { ChevronRight, Globe2, MapPin, Menu, Minus, Plus, ShoppingCart, Trash2, UserCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import { titleFromSlug } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function SiteHeader() {
  const count = useCartStore((state) => state.count);
  const isOpen = useCartStore((state) => state.isOpen);
  const toggle = useCartStore((state) => state.toggle);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const navLinks = [
    ["/products", "Catalogue"],
    ["/finder", "Product Finder"],
    ["/service-centers", "Service Centers"],
    ["/booking", "Booking"],
    ["/blog", "News"],
    ["/about", "About"],
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

  useEffect(() => {
    const handleScroll = () => {
      setIsCompressed(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[rgba(30,42,35,0.14)] bg-[rgba(255,255,255,0.94)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div
            className={cn(
              "grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-transparent transition-all duration-200",
              isCompressed ? "py-2.5" : "py-4",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isMenuOpen}
                aria-label="Open navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(30,42,35,0.16)] bg-white text-[var(--foreground)] lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <BrandLogo imageClassName={cn("h-9 sm:h-10", isCompressed && "sm:h-9")} priority />
            </div>

            <nav className="hidden items-center justify-center gap-6 lg:flex">
              {navLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)] transition hover:text-[var(--castrol-green-deep)]"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2">
              <span className="hidden items-center gap-2 rounded-lg border border-[rgba(30,42,35,0.16)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)] md:inline-flex">
                <Globe2 className="h-4 w-4" />
                KA / EN
              </span>
              <Link
                href="/service-centers"
                className="hidden items-center gap-2 rounded-lg border border-[rgba(30,42,35,0.16)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] xl:inline-flex"
              >
                <MapPin className="h-4 w-4" />
                Locations
              </Link>
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-lg border border-[rgba(30,42,35,0.16)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] md:inline-flex"
              >
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
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--castrol-green-dark)] bg-[linear-gradient(180deg,var(--castrol-green),var(--castrol-green-dark))] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[var(--castrol-green-deep)]"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-[var(--castrol-green-deep)]">{count}</span>
              </button>
            </div>
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

  if (
    segments.length === 0 ||
    pathname.startsWith("/finder") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/service-centers") ||
    pathname.startsWith("/booking") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/about")
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto w-full max-w-7xl px-5 pt-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-dark)] sm:px-8"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition hover:text-[var(--castrol-green-deep)]">
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" />
              {index === segments.length - 1 ? (
                <span className="text-[var(--foreground)]">{titleFromSlug(segment)}</span>
              ) : (
                <Link href={href} className="transition hover:text-[var(--castrol-green-deep)]">
                  {titleFromSlug(segment)}
                </Link>
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
    <footer className="border-t border-[rgba(30,42,35,0.14)] bg-[var(--charcoal)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:min-h-[18rem] lg:grid-cols-[1.25fr_2fr] lg:items-end">
        <div className="space-y-4 lg:self-end">
          <BrandLogo className="w-fit rounded-md bg-white/96 px-3 py-2" imageClassName="h-8 sm:h-9" />
          <h2 className="font-display text-4xl uppercase tracking-[0.08em] text-white">Authorized Service and Product Platform</h2>
          <p className="max-w-xl text-sm leading-7 text-[rgba(255,255,255,0.72)]">
            Official Castrol product discovery, local branch booking, and service-center support for drivers, workshops, and fleet operators in Georgia.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:self-end">
          <FooterColumn
            title="Products"
            links={[
              ["/products", "Catalogue"],
              ["/products/families/edge", "Passenger Range"],
              ["/products/families/vecton", "Fleet Range"],
              ["/finder", "Product Finder"],
            ]}
          />
          <FooterColumn
            title="Services"
            links={[
              ["/service-centers", "Service Centers"],
              ["/booking", "Book Service"],
              ["/contact", "Contact"],
              ["/related-websites", "Related Websites"],
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              ["/about", "About"],
              ["/blog", "News and Insights"],
              ["/account", "Account"],
              ["/service-centers", "Branches"],
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              ["/legal/privacy", "Privacy"],
              ["/legal/terms", "Terms"],
              ["/legal/cookies", "Cookies"],
              ["/", "KA / EN"],
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.62)]">{title}</p>
      <div className="grid gap-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="text-sm text-[rgba(255,255,255,0.86)] transition hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
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
    <div className="fixed inset-0 z-[45] flex bg-[rgba(34,42,46,0.38)] backdrop-blur-sm" onClick={close}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="flex h-full w-full max-w-[22rem] flex-col border-r border-[rgba(30,42,35,0.14)] bg-[rgba(255,255,255,0.98)] shadow-[24px_0_80px_rgba(30,42,35,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[rgba(30,42,35,0.12)] px-5 py-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--castrol-red)]">Navigation</p>
            <BrandLogo imageClassName="h-8 sm:h-9" onClick={close} />
            <p className="text-sm text-[var(--muted-foreground)]">Browse the core product, service, and content sections.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-[rgba(30,42,35,0.16)] p-2 text-[var(--muted-foreground)] transition hover:border-[var(--castrol-green-dark)] hover:text-[var(--foreground)]"
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
              className="rounded-xl border border-[rgba(30,42,35,0.12)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] shadow-[0_8px_18px_rgba(30,42,35,0.06)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-[rgba(30,42,35,0.12)] px-4 py-5">
          <Link
            href="/account"
            onClick={close}
            className="flex items-center gap-3 rounded-xl border border-[rgba(30,42,35,0.12)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] shadow-[0_8px_18px_rgba(30,42,35,0.06)]"
          >
            <UserCircle2 className="h-4 w-4" />
            Account
          </Link>
          <Link
            href="/service-centers"
            onClick={close}
            className="flex items-center gap-3 rounded-xl border border-[rgba(30,42,35,0.12)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] shadow-[0_8px_18px_rgba(30,42,35,0.06)]"
          >
            <MapPin className="h-4 w-4" />
            Locations
          </Link>
          <div className="flex items-center gap-3 rounded-xl border border-[rgba(30,42,35,0.12)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)] shadow-[0_8px_18px_rgba(30,42,35,0.06)]">
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
