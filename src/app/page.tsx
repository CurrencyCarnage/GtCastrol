import { ArrowRight, CarFront, Truck, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HomeToolsSwitcher } from "@/components/home-tools-switcher";
import { Card, LinkButton, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Home",
  path: "/",
});

const journeys = [
  {
    title: "Passenger Cars",
    description: "Find approved Castrol products and service routes for everyday driving.",
    href: "/finder",
    action: "Start car journey",
    Icon: CarFront,
  },
  {
    title: "Commercial / Fleet",
    description: "Support transport, logistics, and heavy-duty operations with fleet-ready products.",
    href: "/products/families/vecton",
    action: "Explore fleet products",
    Icon: Truck,
  },
  {
    title: "Workshops / Partners",
    description: "Connect service providers with Castrol product pathways and customer demand.",
    href: "/account/register?role=affiliate",
    action: "Register as partner",
    Icon: Wrench,
  },
] as const;

export default function HomePage() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);

  return (
    <div className="page-shell space-y-16 sm:space-y-20">
      <section className="reveal-up relative flex min-h-[34rem] items-center justify-center overflow-hidden rounded-[2rem] border border-[rgba(30,42,35,0.08)] bg-[var(--background)] px-5 py-16 shadow-[0_24px_56px_rgba(30,42,35,0.08)] sm:min-h-[38rem] sm:px-9 lg:min-h-[42rem] lg:px-12">
        <Image
          src="/castrol_product.png"
          alt="Castrol product range"
          fill
          priority
          sizes="(min-width: 1440px) 88rem, 100vw"
          className="object-cover object-[center_38%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,34,18,0.1),rgba(4,34,18,0.34)),radial-gradient(circle_at_50%_48%,rgba(0,154,68,0.04),rgba(5,44,22,0.3)_82%)]" />

        <div className="relative z-10 mx-auto max-w-5xl space-y-7 text-center">
          <div className="space-y-5">
            <h1 className="font-sans text-3xl font-extrabold uppercase leading-[0.94] tracking-[0.02em] text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.3)] sm:text-5xl lg:text-6xl">
              The clearer way to choose Castrol products and service in Georgia.
            </h1>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/finder" className="justify-center sm:w-auto">
              Find the right product
            </LinkButton>
            <LinkButton href="/booking" variant="secondary" className="justify-center sm:w-auto">
              Book a service
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="space-y-7 reveal-up">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            eyebrow="Choose your route"
            title="Start with the journey that matches your need"
            description=""
            titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {journeys.map(({ title, description, href, action, Icon }) => (
            <Link
              key={title}
              href={href}
              className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <Card tone="surface" className="flex h-full flex-col gap-5 p-6 sm:p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--brand-soft)] text-[var(--castrol-green-deep)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-2">
                  <h2 className="font-sans text-2xl font-extrabold uppercase leading-[0.98] tracking-[0.02em] text-[var(--foreground)]">
                    {title}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
                </div>
                <span className="mt-auto inline-flex items-center text-sm font-semibold uppercase tracking-[0.1em] text-[var(--castrol-green-deep)]">
                  {action} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="homepage-tools" className="space-y-7 reveal-up">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            eyebrow="Core tools"
            title="One focused place for the main actions"
            description=""
            titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
          />
        </div>
        <HomeToolsSwitcher />
      </section>

      <section className="space-y-7">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            eyebrow="Featured products"
            title="A lighter look at key product families"
            description=""
            titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <Card tone="surface" className="flex h-full flex-col gap-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-green-deep)]">{product.segment}</p>
                <h3 className="font-sans text-2xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
                  {product.name}
                </h3>
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">{product.headline}</p>
                <span className="mt-auto inline-flex items-center text-sm font-semibold uppercase tracking-[0.1em] text-[var(--castrol-green-deep)]">
                  View product <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
