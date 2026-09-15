# Thomas Mohr — developer portfolio

Personal portfolio for Thomas Mohr, built with [Astro](https://astro.build), TypeScript and Tailwind CSS, and deployed
to GitHub Pages via GitHub Actions.

## Stack

- [Astro](https://astro.build) — static-first framework, ships zero JS by default
- TypeScript — strict mode, used for client-side scripts and Astro components
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- GitHub Actions — builds and deploys to GitHub Pages on every push to `master`

## CV

The `/cv` page is generated at build time from [`src/content/cv/cv.md`](src/content/cv/cv.md) — a single Markdown
file with frontmatter for structured fields (contact info, focus areas, tools, experience, education) and a
Markdown body for the profile text. To update the CV, edit that file and rebuild; there's no in-browser editing or
local storage involved. The file's shape is validated against a schema in
[`src/content/config.ts`](src/content/config.ts). The page has a **Print / save PDF** button to export the live
Markdown-driven version.

## Local development

```sh
npm install
npm run dev       # start the dev server at http://localhost:4321
npm run build     # type-check and produce a static build in ./dist
npm run preview   # preview the production build locally
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `./dist` to GitHub
Pages. In the repository settings, set **Settings → Pages → Source** to **GitHub Actions** for this to take effect.
