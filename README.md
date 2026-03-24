# Castrol Georgia App

Production-oriented Next.js foundation for the Castrol Georgia web platform. The current scope covers the first runnable pass of the marketing shell, catalogue, product finder MVP, service center listing, booking entry, content templates, analytics scaffolding, and typed seed domain models.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Structure

- `src/app` - App Router layouts and route groups
- `src/features` - feature-first domain modules
- `src/components` - shared layout and UI primitives
- `src/data` - seed data and future import adapters
- `src/lib` - analytics, SEO, i18n, map abstraction, utilities
- `src/types` - normalized domain model types
- `docs` - architecture and implementation records

## Notes

- Real client Excel files currently live outside the app and are represented here through normalized seed data derived from their product families.
- The uppercase `GtCastrol/GtCastrol` folder is the canonical app. The sibling lowercase `gt-castrol` folder is the redundant starter scaffold and should be removed once you are comfortable with the current app state.
