# Thomas Mohr — developer portfolio

A personal portfolio and CV site for Thomas Mohr, built with [Astro](https://astro.build), TypeScript, and Tailwind CSS. It is deployed to GitHub Pages with GitHub Actions.

## Overview

This site presents a profile, selected work, experience, and contact details using shadcn/ui components. The portfolio and the `/cv` page are generated from a single typed source of truth in [`src/data/cv.ts`](src/data/cv.ts), so updates can be made in one place without duplication.

## Stack

- [Astro](https://astro.build) — static-first site generation and routing
- TypeScript — typed content and client-side scripting
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com/docs/installation/astro) — React components built on Radix UI, using the Nova preset
- Astro React integration — server-rendered content, with hydration for navigation, theme selection, and project detail accordions
- Geist — locally bundled variable font
- GitHub Actions — automated build and deployment to GitHub Pages

## Project structure

```text
.
├── src/
│   ├── components/       # Reusable UI pieces
│   ├── data/             # Typed portfolio and CV content
│   ├── layouts/          # Base page layouts
│   ├── pages/            # Route entry points
│   ├── scripts/          # Client-side interactions
│   ├── styles/           # Global styles and theme tokens
│   └── ...
├── public/               # Static assets and favicons
├── .github/workflows/    # Deployment automation
├── astro.config.mjs      # Astro configuration
├── package.json          # Project scripts and dependencies
├── README.md             # Project overview and setup
└── tsconfig.json         # TypeScript config
```

## CV and content model

The `/cv` page is a static render of the live CV content defined in [`src/data/cv.ts`](src/data/cv.ts). It includes profile details, contact information, skills, work history, and education. The downloadable `/cv.pdf` is generated from the same source at build time. There is no in-browser editing or local persistence for the CV itself.

## Theme preference

The site supports `System`, `Light`, and `Dark` modes. The selected theme is persisted in the browser via `localStorage`, while the `System` option falls back to the operating system preference via `prefers-color-scheme`. Semantic shadcn-style tokens in `src/styles/global.css` keep colors, borders, radii, and controls consistent across both modes.

## UI components

The official shadcn CLI configuration lives in `components.json`. Component source is installed in `src/components/ui/`; the pages use Button, Card, Badge, Alert, DropdownMenu, Sheet, and Accordion primitives rather than custom equivalents. Astro renders static components without hydration. Links share shadcn's exported `buttonVariants`, and interactive islands use `client:load`.

The hero retains its original Field notes content. The homepage has no skills marquee or strip; the full skills list is available on the CV. Project-specific technology badges remain in case studies. The CV uses an Alert for the full availability sentence rather than a single-line Badge.

The sticky header keeps the CV action visible without a duplicate floating button. On mobile, navigation uses the default Sheet and the theme toggle stays in the header. Case studies lead with a tinted project summary and highlighted results; standard shadcn Accordions reveal challenge/contribution and technology details on demand. All factual project copy remains available. The hero flows directly into selected work, with a "View selected work" jump link rather than an empty spacer. Generated primitives in `src/components/ui/` retain their upstream styles; app-level classes handle content layout and responsiveness.

Add another component with:

```sh
pnpm exec shadcn add <component>
```

Theme colors use shadcn's semantic CSS variables in `src/styles/global.css`: blue actions and pale blue surfaces in light mode, slate/navy surfaces and light blue highlights in dark mode. Shared tokens carry through the portfolio, CV, and controls. Restart the dev server after changing integrations or dependencies.

Geist's Latin font subsets are preloaded and use `font-display: optional` to avoid a visible late font swap. On a slow first visit, the system font stays in place for that page load rather than redrawing already-visible text; subsequent loads can use the cached Geist font.

### Dependencies added for shadcn

shadcn supplies component source, not a single opaque runtime widget library. This project selected the **Radix Nova** preset. Radix is required by those generated interactive components and Slot-based composition, but is not a requirement of Astro or every shadcn preset; Base UI is another supported foundation. Switching foundations would replace component implementations, not simply remove a package.

| Package | Purpose in this project | Classification |
| --- | --- | --- |
| `react` | Component rendering and state for hydrated islands | Dependency |
| `react-dom` | Astro's React renderer and browser hydration | Dependency |
| `radix-ui` | Sheet focus trapping/dismissal, dropdown and Accordion keyboard handling, and Slot composition | Dependency |
| `class-variance-authority` | Generated Button, Badge, and Alert variant definitions | Dependency |
| `cn` | Generated class-name merging helper; combines classes and resolves Tailwind conflicts | Dependency |
| `lucide-react` | Icons used by the theme toggle, navigation, and generated components | Dependency |
| `@astrojs/react` | Astro integration that compiles and renders React components during development/build | Dev dependency |
| `@types/react` | React TypeScript declarations, not executable code | Dev dependency |
| `@types/react-dom` | React DOM TypeScript declarations, not executable code | Dev dependency |
| `shadcn` | Component-generation CLI and `shadcn/tailwind.css` consumed during CSS compilation | Dev dependency |
| `tw-animate-css` | Build-time CSS utilities for generated Sheet/dropdown transitions | Dev dependency |
| `@fontsource-variable/geist` | Font CSS and local font files copied into the static output | Dev dependency |

Build tooling and assets must be installed for `pnpm build` even though they are dev dependencies. The deployed site serves `dist/`; it does not run Node or require a production-only package installation. Font files and compiled CSS still reach the browser. Runtime dependencies are bundled only where used, and package installation size is not the same as browser download size.

For a simple portfolio, Astro + Tailwind without React/Radix would be leaner. The trade-off here is the requested stock shadcn UI: consistent variants and tested interaction semantics instead of maintaining custom menus and disclosure controls. Static Field notes and CV content do not hydrate; case-study Cards hydrate for their Accordions.

## Local development

```sh
pnpm install
pnpm run dev       # start the dev server at http://localhost:4321
pnpm run build     # type-check and produce a static build in ./dist
pnpm run preview   # preview the production build locally
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and publishes the generated `./dist` output to GitHub Pages. In the repository settings, make sure **Settings → Pages → Source** is set to **GitHub Actions**.

## Notes

- The portfolio is intentionally lightweight and static-first.
- The site is designed to be easy to maintain by centralizing content in typed source files.
- The visual design uses a restrained neutral palette, semantic design tokens, and locally bundled Geist typography while remaining responsive across screen sizes.
