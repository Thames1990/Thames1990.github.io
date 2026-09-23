# Thomas Mohr — developer portfolio

Personal portfolio for Thomas Mohr, built with [Astro](https://astro.build), TypeScript and Tailwind CSS, and deployed
to GitHub Pages via GitHub Actions.

## Stack

- [Astro](https://astro.build) — static-first framework, ships zero JS by default
- TypeScript — strict mode, used for client-side scripts and Astro components
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- GitHub Actions — builds and deploys to GitHub Pages on every push to `master`

## CV

The `/cv` page and the portfolio are generated from the typed source in
[`src/data/cv.ts`](src/data/cv.ts). It contains the profile, contact information, skills, experience, and education,
so updates do not need to be made in multiple places. The page has a **Print / save PDF** button to export the live
CV data. There is no in-browser editing or local storage involved.

## Local development

```sh
pnpm install
pnpm run dev       # start the dev server at http://localhost:4321
pnpm run build     # type-check and produce a static build in ./dist
pnpm run preview   # preview the production build locally
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `./dist` to GitHub
Pages. In the repository settings, set **Settings → Pages → Source** to **GitHub Actions** for this to take effect.
