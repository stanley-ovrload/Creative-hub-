# Creative Hub — Console Design Spec

The design system for the internal marketing-agent console. Build the UI to this. It serves two sister brands (Ovrload + Cloud), so the console is a neutral, light, premium base and each brand appears only as a functional accent — never skin the whole tool as one brand.

Overall feel: a polished, paid SaaS tool — calm, confident, spacious. Reference points: the clean restraint of Linear / Notion / Vercel. Considered spacing and clear hierarchy over dense enterprise tables. If it feels cramped or flat, it's wrong.

## Concept

- Light neutral base, brand as accent. White/off-white surfaces, generous whitespace, clean type. Brand identity shows up only as small colour-coded chips and accents, not a full re-skin.
- The bridge. Ovrload's gradient runs blue → teal → green, and its green end is Cloud's colour. The house accent is that gradient; Ovrload elements lean blue, Cloud elements lean green.
- Two colour systems, kept apart. Brand colour and status colour must never be confused. Brand = a lowercase tinted chip (left). Status = a solid tinted pill (right). Different shape, different position.

## Layout

- Centred max-width container of ~1100–1200px for the main content — never let content pin to the top-left of a full-width window.
- Generous padding: ~28px around the main area; ~16–18px inside cards/panels; comfortable gaps between sections.
- Let it breathe. Rows get ~15px vertical padding; sections are clearly separated.

## Sidebar

- Width ~220–240px. White surface, hairline right border.
- Nav labels ~15–16px, lowercase, with a 19–20px icon each; ~11px vertical padding per item.
- Items: new request · job board · outputs · brand memory.
- Active state: soft green tint background (#E8F5EC) with a slightly darker green label — calm, not loud.
- App wordmark "creative hub" top-left, next to a small gradient logo mark.

## Typography

- Headings / UI: Satoshi, Medium (500). Source: Fontshare. Fallback Inter, system-ui, sans-serif.
- Body / supporting: Figtree. Source: Google Fonts. Fallback Inter, system-ui, sans-serif.
- Emphasis: Satoshi Bold Italic for the single hero word in a heading — sparingly.
- Case: all UI labels lowercase — page titles, headings, nav, buttons, form labels, chips, pills. (Only user-typed content and data values like "Ovrload"/"Cloud" keep their casing.)
- Type scale: Page title 28–32px weight 600 tracking ~-0.025em; Section heading 18–20px weight 500–600; Body 14–15px; Meta/sub-line 12–13px muted.
- Copy: British English; use "+" instead of "and".

## Colour

Base (light): App background #F7F8F7; Surfaces/cards #FFFFFF; Hairline borders #ECEEEC (rows #F1F2F1); Text primary #1E1E1E, secondary #4A4F4B, muted #9AA0A6.

House accent: Gradient linear-gradient(90deg, #008EFF, #00BD9B, #8AB976). Used sparingly — primary button, logo mark, occasional 3px accent lines. Never a background wash. Light green #E8F5EC is the ambient accent (active nav, hovers, subtle tints).

Brand accents (functional chips): Ovrload blue #008EFF, chip rgba(0,142,255,0.10) bg / #0084EB text. Cloud green #2E9E5B, chip rgba(46,158,91,0.12) bg / #2E9E5B text. Pink #ED6D9D is a supporting accent for highlights/badges only.

Status pills (solid tinted, on white): queued bg #F0F1F0 text #6E7671; running bg #E7F1FF text #1D74D6; in qc bg #FFF3E0 text #B26A00 (self-healing/re-prompting); done bg #E7F5EC text #1E8E4A (prefix ✓); hard break bg #FDEBEC text #C0392B (prefix ⚠, Messenger has emailed the team). Give done and hard break an icon as well as colour.

## Shape + spacing

- Radius: ~14–16px cards/panels, ~10px buttons/nav, ~20px pills, ~7px chips.
- Borders: hairline, low-contrast. Density: roomy.

## Components

- Buttons/CTAs: primary = the gradient, white text, ~10px radius; lowercase label, optional trailing arrow →. Secondary = hairline outline.
- Brand chip: fixed-width lowercase tinted chip.
- Job row: [brand chip] [title + muted sub-line] [status pill] [time], ~15px vertical padding.
- Status pill: solid tinted, lowercase, small; icon on done/hard break.
- Output card: brand chip + preview/thumbnail + lowercase title + download control.
- New request: brand selector + brief textarea only — no request-type selector (the orchestrator infers the type from the brief; new jobs read "routing…" until classified).

## Do / Don't

Do: keep everything lowercase; give real type hierarchy; use a centred max-width container; let it breathe; keep brand chips and status pills visually separate; add icons to done/hard-break; British English.

Don't: theme the whole console as Ovrload or Cloud; let Cloud's brand green blur into the "done" green; wash backgrounds in the gradient; cram content into the top-left; make everything one tiny font size.
