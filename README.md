# Thomas Mohr — developer portfolio

A personal portfolio and CV site for Thomas Mohr, built with [Astro](https://astro.build), TypeScript, and Tailwind CSS. It is deployed to GitHub Pages with GitHub Actions.

## Overview

This site presents a profile, selected work, experience, and contact details in a clean, editorial layout. The portfolio and the `/cv` page are generated from a single typed source of truth in [`src/data/cv.ts`](src/data/cv.ts), so updates can be made in one place without duplication.

## Stack

- [Astro](https://astro.build) — static-first site generation and routing
- TypeScript — typed content and client-side scripting
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- GitHub Actions — automated build and deployment to GitHub Pages
- Google Fonts — typography used across the interface

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

The `/cv` page is a static render of the live CV content defined in [`src/data/cv.ts`](src/data/cv.ts). It includes profile details, contact information, skills, work history, and education. There is no in-browser editing or local persistence for the CV itself.

## Theme preference

The site supports `System`, `Light`, and `Dark` modes. The selected theme is persisted in the browser via `localStorage`, while the `System` option falls back to the operating system preference via `prefers-color-scheme`.

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
- The visual design is tuned to feel editorial and minimal, while remaining responsive across screen sizes.
