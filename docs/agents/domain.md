# Domain Docs

How engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- `GLOSSARY.md` at the repo root.
- Relevant ADRs in `docs/adr/`.

If these files do not exist, proceed silently; create them only when a domain term or decision is resolved.

## File structure

This is a single-context repo: keep the glossary at the root and ADRs in `docs/adr/`.

## Use the glossary's vocabulary

Use terms as defined in `GLOSSARY.md` in issue titles, hypotheses, test names, and refactor proposals. Avoid synonyms the glossary rejects. If a needed domain concept is missing, note the gap for domain modeling rather than inventing implementation language.

## Flag ADR conflicts

Surface contradictions with relevant ADRs explicitly rather than silently overriding them.
