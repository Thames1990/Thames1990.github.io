---
name: Thomas Mohr Portfolio
description: An evidence-led portfolio with the feel of a working technical instrument.
colors:
  paper: "#f1f1eb"
  ink: "#1c211e"
  card: "#e9eae3"
  popover: "#f7f7f2"
  primary: "#c94829"
  primary-foreground: "#ffffff"
  secondary: "#e1e3da"
  secondary-foreground: "#282e29"
  muted: "#e8e9e2"
  muted-foreground: "#505951"
  accent: "#d8e34b"
  border: "#babdb5"
  input: "#9da39a"
  dark-background: "#151917"
  dark-foreground: "#f0f1e9"
  dark-card: "#202521"
  dark-popover: "#252b26"
  dark-primary: "#f07a55"
  dark-primary-foreground: "#181c19"
  dark-secondary: "#222824"
  dark-secondary-foreground: "#f0f1e9"
  dark-muted: "#282e29"
  dark-muted-foreground: "#c0c5bd"
  dark-accent: "#c7d941"
  dark-accent-foreground: "#181c19"
  dark-border: "#414942"
  dark-input: "#545c54"
typography:
  display:
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif"
    fontSize: "clamp(3rem, 7vw, 6.5rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.05em"
  title:
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.4rem)"
    fontWeight: 750
    lineHeight: 0.98
    letterSpacing: "-0.06em"
  body:
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  action:
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
  label:
    fontFamily: "ui-monospace, 'SFMono-Regular', Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "0.09em"
rounded:
  control: "4px"
  small: "2.4px"
  medium: "3.2px"
  square: "0px"
spacing:
  unit: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "clamp(72px, 9vw, 128px)"
  hero: "clamp(56px, 8vw, 112px)"
components:
  button-primary:
    backgroundColor: "{colors.dark-primary}"
    textColor: "#191d1a"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "12px 16px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#ff9774"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "12px 16px"
    height: "48px"
  technical-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "2px 8px"
    height: "20px"
  case-study-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "clamp(28px, 4vw, 48px) 0"
  evidence-panel:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "clamp(18px, 3vw, 28px)"
---

# Design System: Thomas Mohr Portfolio

## Overview

**Creative North Star: "Signal Bench"**

The Signal Bench makes this portfolio feel like a working instrument: a dark chassis presents verified outcomes in compact, ruled readouts, while paper-toned surfaces keep the longer work and career easy to read. The tone is confident and tactile, but never slick or ornamental. Visible structure, useful labels, and measurable evidence do the persuasive work.

A tightly tracked sans voice carries role and project headlines; a restrained monospaced layer handles dates and short technical labels. Warm orange marks action and proof, while chartreuse is a small state signal. Surfaces remain flat: contrast, negative space, and hairlines provide hierarchy. Motion is purposeful and yields to reduced-motion preferences.

**Key Characteristics:**
- Evidence before ornament.
- Instrument labels, not decorative jargon.
- Paper and chassis contrast, with sparse color marks.
- Flat surfaces, hairline rules, and generous section rests.

## Colors

Warm paper and blackened panels establish the two surfaces; oxide orange and chartreuse are reserved for concise, high-value signals.

### Primary
- **Oxide Red:** The light-theme primary for CV headings, project outcomes, dates, and focused link states.
- **Warm Signal:** The dark-theme primary and the filled action/result color on the instrument panels.

### Secondary
- **Signal Chartreuse:** A small highlight for the evidence-panel heading and state-like labels; not a body-text color.

### Neutral
- **Paper Stock and Graphite Ink:** The default reading surface and its main text color.
- **Ash Surface and Raised Paper:** Quiet tonal steps for cards, menus, and secondary content.
- **Blackened Chassis and Instrument Chalk:** The dark-theme canvas and its readable foreground.
- **Chassis Panel and Night Muted Surface:** Layered dark-theme surfaces; keep their distinction subtle.
- **Quiet Graphite and Night Muted Copy:** Secondary text, not the primary color for headings.
- **Paper Edge and Chassis Edge:** Hairline dividers and component boundaries.

**The Signal Marks Rule.** Use orange for direct actions, outcome values, and targeted emphasis; reserve chartreuse for short state labels. Long reading stays in the neutral text colors.

## Typography

**Display Font:** Avenir Next, with Segoe UI and the system sans-serif stack as fallbacks.  
**Body Font:** The same system sans-serif stack.  
**Label/Mono Font:** `ui-monospace`, SFMono-Regular, Consolas, monospace.

**Character:** The sans face is sturdy and legible, with tight headline tracking that gives the work a clear point of view. Monospace is a functional instrument cue for short metadata, not a second voice for paragraphs.

### Hierarchy
- **Display** (weight 600, 3rem to 6.5rem, 0.94 line-height): The role-led homepage statement.
- **Headline** (weight 600, 2.25rem to 3.75rem, 0.98 line-height): Section headings; the larger size begins at the 48rem layout breakpoint.
- **Title** (weight 750, 2rem to 3.4rem, 0.98 line-height): Project titles and other high-emphasis content.
- **Body** (weight 400, 1rem, 1.7 line-height): Main reading copy, generally constrained to 36–42rem.
- **Label** (weight 650, 0.7rem, 0.09em tracking, uppercase): Dates, short technical metadata, and instrument labels.

**The Instrument Label Rule.** Keep monospace uppercase type to brief metadata, dates, and readout labels; use the sans face for every paragraph.

## Layout

Center content in a shell capped at 1120px. On narrow screens, retain 20px side gutters; from 48rem upward, use 40px. The homepage hero and project rows stack on mobile, then form asymmetric two-column layouts at 48rem. The CV similarly moves from one column to a narrow contact sidebar and a wide reading column. Below 360px, compact the header action label rather than letting the header overflow.

Use a 4px spacing unit with recurring 8px, 16px, 24px, and 32px steps. Section rests are deliberately larger than component gaps; the work, approach, and experience chapters use a responsive 72px–128px vertical rhythm. Keep copy measures comfortable and preserve the open row structure rather than compressing everything into a dense dashboard.

**The Open Work Rule.** Project summaries remain open, divider-separated rows; put outcomes next to their context instead of nesting every project inside a card.

## Elevation & Depth

The system is flat by default and has no shadow vocabulary. Depth comes from tonal surface changes, a dark chassis against paper, thin rules, and whitespace. Interactive focus is explicit, but should not be mistaken for ambient elevation.

**The Hairline-First Rule.** Use surface contrast and a fine border to separate regions; do not add decorative drop shadows.

## Shapes

The form language is mostly square: project rows, evidence panels, CV notices, and technical badges have no rounded container corners. Shared controls retain only a tight 4px radius. Prefer straight dividers and underlined text links over pills, capsules, or ornamental outlines.

## Components

### Buttons
- **Character:** Direct, compact actions with a clear color or outline contrast.
- **Primary:** Warm Signal fill with dark text on the dark hero/contact surface; 48px minimum height and 12px by 16px padding.
- **Secondary:** Transparent with a quiet border and light text on dark surfaces.
- **Hover / Focus:** Shift the signal fill or strengthen the outline on hover; preserve the global visible 2px focus outline with offset.

### Chips
- **Style:** Technical badges are transparent, square, and outlined with the current theme border; use compact monospace text.
- **State:** Badges label technologies; they are not styled as interactive filters.

### Cards / Containers
- **Case studies:** Open rows with a top rule, generous vertical padding, and a two-column summary/outcomes layout at desktop widths.
- **Evidence panel:** A square, dark instrument surface with one-pixel border, chartreuse heading, ruled result rows, and orange metrics.
- **Shadow Strategy:** None; rely on tonal contrast and rules.

### Navigation
- **Style:** A compact wordmark and section links sit in a paper-toned, hairline-separated header. Desktop section links appear from 768px; mobile uses an anchored dropdown spanning the page's full content width. Show section navigation only on the portfolio page; the CV header keeps its return action and theme control.
- **State:** Use the theme's foreground/background pairing by default, with the primary color reserved for hover and emphasis.

### CV
- **Style:** Treat the CV as a readable document rather than a dashboard: a clear title, thin section rules, restrained orange section labels, and a narrow metadata rail beside the main career narrative on desktop.
- **Responsive behavior:** Stack the metadata and career content on mobile; keep the PDF action full-width there.

## Do's and Don'ts

### Do:
- **Do** lead with specific, verifiable outcomes and keep their labels easy to scan.
- **Do** use hairlines, open space, and alternating tonal surfaces to establish hierarchy.
- **Do** keep the full CV and a clear contact action easy to reach on mobile and desktop.
- **Do** honor visible focus and reduced-motion preferences.

### Don't:
- **Don't** treat the former blue styling as a binding identity.
- **Don't** turn every project into a rounded, shadowed card.
- **Don't** use orange or chartreuse for long passages of text.
- **Don't** rely on motion to reveal content or communicate essential state.
