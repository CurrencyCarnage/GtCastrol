# Castrol Georgia Architecture

## Goals

- Build a premium automotive web platform for Georgia.
- Combine brand storytelling, product discovery, service-center trust, booking, and commerce readiness.
- Keep the frontend cleanly separated from future Excel imports, APIs, CMS content, CRM sync, and analytics vendors.

## Current Structure

- `src/app` uses Next.js App Router with route groups for catalogue, finder, booking, marketing, account, and legal.
- `src/lib/site-data.ts` holds typed seed data and helper selectors derived from the client brief and catalogue family structure.
- `src/types/domain.ts` defines normalized models for catalogue, service centers, content, finder inputs, and analytics.
- `src/components` contains shared shell and UI primitives.
- `src/features` contains interactive client features: finder and booking.
- `src/store` holds lightweight client cart state with Zustand.

## First-Pass Flows

- `/` premium home page with family, product, booking, and content CTAs
- `/products` catalogue listing
- `/products/families/[familySlug]` family pages
- `/products/[productSlug]` product detail pages with pack-size and cart hooks
- `/finder` product finder MVP
- `/service-centers` service center listing
- `/booking` booking MVP
- `/blog`, `/campaigns/[slug]`, `/about`, `/contact`, `/account`, `/legal/[slug]`

## Readiness Notes

- Catalogue families are seeded from the client Excel workbook tabs.
- Pricing is placeholder-only and clearly separated from future backend pricing logic.
- Booking availability is mocked behind a query-driven client layer.
- Analytics is typed and UI-agnostic through `src/lib/analytics.ts`.
