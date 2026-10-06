# Thomas Mohr — developer portfolio

A personal portfolio and CV site for Thomas Mohr, built with Astro, React, TypeScript, and Tailwind CSS. The site is statically generated and deployed to GitHub Pages.

## Site

The production site is [https://mohrworks.com](https://mohrworks.com), hosted on GitHub Pages. `astro.config.mjs` defines the production origin used by canonical links, social metadata, structured data, and the sitemap. Keep the sitemap URL in `public/robots.txt` aligned with it.

- `/` presents selected projects, experience, and contact information.
- `/cv` presents the full CV and provides a PDF download from `/cv.pdf`.
- CV and case-study content is maintained in [`src/data/cv.ts`](src/data/cv.ts).

## Technology

- [Astro](https://astro.build) generates the site.
- [React](https://react.dev) powers interactive components.
- [Tailwind CSS](https://tailwindcss.com) styles the site.
- TypeScript provides typed content and client-side scripts.
- GitHub Actions builds, tests, and deploys the site to GitHub Pages.

## Development

Use Node.js 24 and pnpm 12.6. Install dependencies and start the local development server:

```sh
pnpm install
pnpm dev
```

Run the available checks and build commands:

```sh
pnpm test          # run unit tests
pnpm test:e2e      # run Playwright end-to-end tests
pnpm build         # run unit tests, Astro checks, and create ./dist
pnpm preview       # serve the production build locally
```

Install the Playwright Chromium browser before running end-to-end tests for the first time:

```sh
pnpm exec playwright install chromium
```

## Deployment

The GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs for pull requests targeting `main`, pushes to `main`, and manual runs. It runs unit and end-to-end tests plus Astro checks and a production build. Successful pushes and manual runs deploy the site to GitHub Pages. Set the repository's Pages source to **GitHub Actions**.

## Project structure

```text
.
├── .github/workflows/  # Build and deployment workflow
├── public/             # Static assets
└── src/
    ├── components/     # Site and UI components
    ├── data/           # CV and case-study content
    ├── layouts/        # Shared page layout
    ├── pages/          # Site routes, including the CV and PDF
    ├── scripts/        # Client-side interactions and PDF generation
    └── styles/         # Global styles
```
