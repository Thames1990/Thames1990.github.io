# Thomas Mohr — developer portfolio

Personal portfolio for Thomas Mohr, built with [Astro](https://astro.build), TypeScript and Tailwind CSS, and deployed
to GitHub Pages via GitHub Actions.

## Stack

- [Astro](https://astro.build) — static-first framework, ships zero JS by default
- TypeScript — strict mode, used for client-side scripts and Astro components
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- GitHub Actions — builds and deploys to GitHub Pages on every push to `master`

## CV

Visit `/cv` to edit the starter CV directly in the browser. Changes are saved to that browser's local storage and can
be exported with the **Print / save PDF** button. The original German PDF remains available at
[`public/files/CV.pdf`](public/files/CV.pdf).

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
