# GSE75606 Gene Expression Dashboard — Design Ideas

<response>
<text>
## Idea 1: Dark Lab Terminal
**Design Movement:** Brutalist Data Laboratory / Cyberpunk Scientific
**Core Principles:**
1. Monochromatic dark base with high-contrast neon accent highlights
2. Monospaced data typography mixed with bold display headers
3. Grid-based layout with visible structural lines (1px borders, no shadows)
4. Dense information density — every pixel earns its place

**Color Philosophy:** Near-black (#0D0F14) background with electric teal (#00E5CC) for data highlights and amber (#F5A623) for warnings/alerts. White (#F0F4F8) for primary text. Evokes a genomics sequencing terminal.

**Layout Paradigm:** Full-width sidebar (260px) on the left with navigation. Main content area uses a strict 12-column grid. Charts fill full-width panels with zero padding between them — raw data density.

**Signature Elements:**
- Monospaced gene name labels on chart axes
- Thin 1px grid lines on all chart backgrounds
- "Scanning" progress bars on data load

**Interaction Philosophy:** Hover reveals raw numeric values in a tooltip styled like a terminal readout. Click-to-filter genes by pathway.

**Animation:** Fade-in data points sequentially (stagger 20ms per point). No bounce, no spring — purely linear.

**Typography System:** JetBrains Mono for data labels and values; Space Grotesk Bold 700 for headings; JetBrains Mono 400 for body.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Idea 2: Scientific Journal — Structured White
**Design Movement:** Academic Publication / Nature Journal Aesthetic
**Core Principles:**
1. White-dominant layout with structured column grids (like a two-column paper)
2. Serif display font for headings, clean sans-serif for data labels
3. Color used only for data encoding — never decorative
4. Generous whitespace between sections; tight spacing within data blocks

**Color Philosophy:** White (#FFFFFF) background. Deep navy (#1A2B4A) for headings. Data encoded with a carefully chosen 3-color qualitative palette: Human (#2166AC blue), Mouse (#D73027 red), Naked Mole Rat (#1A9850 green). Matches standard genomics color conventions.

**Layout Paradigm:** Two-column asymmetric layout — wide main content (70%) with a sticky right sidebar (30%) for filters and gene search. Charts are framed by thin borders with axis labels in small caps.

**Signature Elements:**
- Small caps section labels (e.g., "FIGURE 1 — PCA ANALYSIS")
- Footnote-style data source citations below each chart
- Species color legend as a persistent sticky element

**Interaction Philosophy:** Hover highlights the corresponding species across ALL charts simultaneously (cross-chart brushing). Click a gene to see its expression profile in a detail panel.

**Animation:** Recharts default animations — bars grow from zero, lines draw left-to-right. Subtle and purposeful.

**Typography System:** Playfair Display 700 for headings; DM Sans 400/500 for body and labels. Front page: 48px/28px/16px. Content: 24px/16px/13px.
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idea 3: Genomics Dashboard — Deep Navy Scientific
**Design Movement:** Modern Bioinformatics Dashboard / Precision Medicine UI
**Core Principles:**
1. Deep navy sidebar with bright white main content area — high contrast structural split
2. Bold condensed headers with lightweight data labels — 4:1 weight contrast
3. Color palette strictly tied to biological meaning (species-specific colors)
4. Modular card-based layout with consistent 24px gutters

**Color Philosophy:** Sidebar: Deep navy (#0F1B2D). Main: Off-white (#F7F9FC). Species colors: Human (#3B82F6 blue), Mouse (#EF4444 red), Naked Mole Rat (#10B981 emerald). Accent: Violet (#7C3AED) for interactive elements. Charts use a sequential blue-to-purple gradient for expression intensity.

**Layout Paradigm:** Fixed left sidebar (240px) for navigation and filters. Main content uses a responsive 2-column card grid. Top bar shows dataset metadata. Each chart card has a title, subtitle, and interactive controls.

**Signature Elements:**
- Species color pills in the sidebar legend
- Gradient expression intensity scale bar on heatmap
- Animated counter showing number of genes displayed

**Interaction Philosophy:** Tab-based navigation between chart types. Dropdown filter for pathway selection. Hover on any data point shows a detailed tooltip with gene name, expression value, and pathway.

**Animation:** Cards fade in with a 50ms stagger. Chart data animates on mount (Recharts built-in). Smooth tab transitions.

**Typography System:** Oswald 700 for sidebar and card headers; Inter 400/500 for body and labels. Front page: 36px/20px/14px. Content cards: 18px/14px/12px.
</text>
<probability>0.09</probability>
</response>
