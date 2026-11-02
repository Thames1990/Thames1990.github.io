# Issue tracker: GitHub

Issues and specs for this repo live in GitHub Issues. Use the `gh` CLI for all operations.

## Conventions

- Create: `gh issue create --title "..." --body "..."` (use a heredoc for multi-line bodies).
- Read: `gh issue view <number> --json number,title,body,labels,comments`.
- List: `gh issue list --state open`; add label/state filters as needed.
- Comment: `gh issue comment <number> --body "..."`.
- Apply/remove labels: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- Close: explain the resolution in a comment, then run `gh issue close <number>`.

Infer the repo from `git remote -v`; run `gh` from the repository. Pull requests are not an issue-triage request surface.

When a skill says “publish to the issue tracker,” create a GitHub issue. When it says “fetch the relevant ticket,” read the GitHub issue.
