# Design Brief

**HireAI** — Professional, modern AI-powered recruitment platform. Trusted, efficient, clarity-focused. Indigo-primary + verdicts (green/yellow/orange/red). Dashboard layout: sticky form left, scrollable results right.

## Tone & Aesthetic

Premium SaaS. Professional without sterile. Trust through clarity—no playfulness, high information density, visual confidence cues (progress bars, badges).

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | `0.52 0.18 270` | Indigo: CTA, navigation, focus |
| Success | `0.68 0.25 120` | Green: Strong Hire verdict |
| Warning | `0.55 0.25 38` | Yellow: Maybe verdict |
| Caution | `0.62 0.25 72` | Orange: Caution verdict |
| Destructive | `0.58 0.24 24` | Red: Reject verdict |
| Background | `0.98 0.001 0` | Off-white, nearly neutral |
| Neutral | `0.92 0.01 0` | Muted sections, borders |
| Foreground | `0.18 0.01 270` | Deep indigo-tinted black |

**Verdict badges**: Solid backgrounds (green/yellow/orange/red) with white text. Inline progress bar gradient: red → yellow → green.

## Typography

| Use | Font | Size | Weight |
|-----|------|------|--------|
| Display | Bricolage Grotesque | 28–32px | 600–700 |
| Body | General Sans | 14–16px | 400–500 |
| Mono | JetBrains Mono | 12–14px | 400 |

Body-first hierarchy. Display used sparingly: page title, section headers, verdict labels. No decorative typography.

## Elevation & Depth

Card hierarchy: `shadow-subtle` (form inputs, sections) → `shadow-elevated` (verdict badge, call-to-action). Borders over shadows where hierarchy is light. No layered depth effects.

## Structural Zones

| Zone | Surface | Decoration |
|------|---------|-----------|
| Header | `bg-card` + `border-b` | Logo, navigation, title |
| Sidebar Form | `bg-background` sticky top | Light gray input fields, 8px radius |
| Main Results | `bg-background` scrollable | Card sections, alternating subtle backgrounds |
| Verdict Section | `bg-card` elevated | Large badge, progress bar, final recommendation |
| Footer | `bg-muted/20` + `border-t` | Disclaimer, export option |

## Spacing & Rhythm

Baseline 8px grid. Form inputs: 12px vertical padding, 16px horizontal. Card sections: 24px outer margin, 16px internal padding. Section gap: 16px. No single-axis padding—maintain balanced whitespace.

## Component Patterns

- **Form**: Stacked inputs, minimal labels, placeholder text. "Generate" CTA fills width with primary color.
- **Result cards**: Collapsible header (title + icon toggle), content, subtle border.
- **Progress bar**: Full width, 8px height, gradient fill with animation (0.8s ease-out).
- **Verdict badge**: Inline-flex, 32px height, bold text, color-coded per outcome.
- **Score breakdown**: 4 rows (Skills 40%, Experience 20%, Communication 20%, Culture Fit 20%), mini progress bars per metric.

## Motion

- Accordion collapse/expand: 0.2s ease-out (radix default).
- Progress bar fill: 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) — slight bounce.
- Section fade-in: 0.3s ease-out on result load.
- Hover: subtle shadow lift, no scale.

## Constraints

- No animations on page load (only on result reveal).
- No decorative gradients—gradients used functionally (progress bars, verdict logic).
- No transparent overlays or glassmorphism.
- Borders: 1px only, `border-color` token.
- Radius: 8px soft corners (cards, inputs, buttons).
- Chart colors serve verdict logic: chart-1=green, chart-2=yellow, chart-3=caution, chart-4=orange, chart-5=red.

## Signature Detail

**Sticky form sidebar**: Unique to recruitment workflows. Keeps input controls always visible while results scroll below. Reduces context-switching. Form remains at viewport top-left even as user scrolls results. Paired with collapsible card sections (each section toggles independently). Together, these create calm, focused interaction—users stay oriented.

## Responsive

Mobile-first. Form + results stack vertically on `sm`. On `md` and above: sidebar fixed left (320px), main area takes remaining width. No responsive font resizing—consistent visual weight across breakpoints.
