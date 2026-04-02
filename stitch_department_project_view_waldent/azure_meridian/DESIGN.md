# Design System Documentation: The Executive Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Glasshouse"**

This design system rejects the "flat and boxy" nature of traditional enterprise dashboards in favor of a sophisticated, editorial-inspired environment. We are moving away from rigid grids and 1px borders toward a philosophy of **Atmospheric Depth**. By leveraging deep blues, slate grays, and the illusion of translucent layers, we create a workspace that feels like a premium physical office—quiet, intentional, and high-performance.

The goal is to provide "Digital Clarity." We break the "template" look through:
*   **Intentional Asymmetry:** Strategic use of white space to draw the eye to high-priority KPIs.
*   **Tonal Anchoring:** Using deep primary shades to anchor the eye, while lighter surface tiers allow secondary data to "float."
*   **Departmental Vibrancy:** Using the vibrant accent palette as a "wayfinding" tool rather than just decoration.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule

The palette is anchored in deep, authoritative blues (`primary`) and neutral slates (`secondary`). 

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off the UI. Boundaries must be defined through background color shifts. 
*   Use `surface` for the base canvas.
*   Use `surface-container-low` for large sidebar or navigation regions.
*   Use `surface-container-lowest` for the most prominent content cards to make them "pop" against the darker background.

### Surface Hierarchy & Nesting
Instead of lines, use the surface tiers to create physical layers:
1.  **Canvas (Base):** `surface` (#f7f9fb)
2.  **Sectioning:** `surface-container` (#eceef0)
3.  **Inner Content/Cards:** `surface-container-lowest` (#ffffff)
4.  **Floating Elements:** `surface-bright` (#f7f9fb) with backdrop-blur.

### The "Glass & Gradient" Rule
To achieve the requested "Modern Enterprise" feel, floating quick-action panels and modal overlays must utilize **Glassmorphism**. 
*   **Formula:** `surface-container-lowest` at 70% opacity + `backdrop-filter: blur(20px)`.
*   **Signature Textures:** For high-level CTA buttons (e.g., "Generate Report"), use a subtle linear gradient from `primary` (#002e78) to `primary-container` (#0043a7). This adds a "jewel-like" depth that flat colors lack.

---

## 3. Typography: Sharp & Editorial

We utilize **Inter** for its mathematical precision and high readability in data-dense environments.

*   **The Display Scale:** Use `display-md` (2.75rem) for main dashboard "Hero KPIs." This creates a bold, editorial focal point.
*   **The Headline Scale:** `headline-sm` (1.5rem) should be used for department titles (Waldent, Logistics, etc.), paired with a vibrant accent color icon.
*   **The Body Scale:** `body-md` (0.875rem) is our workhorse. All data labels and table content live here.
*   **Intentional Contrast:** Always pair a `title-lg` header with `label-md` in `on-surface-variant` (#424750) for metadata to create a clear informational hierarchy.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "heavy" for a sophisticated dashboard. We use **Ambient Shadows** and **Tonal Stacking**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-low` background. This creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (Modals/Quick Actions), use a large, soft shadow: `box-shadow: 0 12px 40px rgba(25, 28, 30, 0.06)`. Note the use of the `on-surface` color (#191c1e) at a very low opacity to mimic natural light.
*   **Ghost Borders:** If a border is required for accessibility in high-density tables, use `outline-variant` (#c2c6d1) at **20% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Quick-Action Buttons
*   **Primary:** Gradient from `primary` to `primary-container`. `border-radius: lg` (0.5rem).
*   **Secondary:** `secondary-container` background with `on-secondary-container` text. No border.
*   **States:** On hover, shift the gradient intensity rather than darkening the color.

### Dynamic Progress Bars
*   **Track:** `surface-container-highest` (#e0e3e5).
*   **Indicator:** Use vibrant department-specific colors (e.g., Waldent: Deep Blue, Logistics: Slate, etc.).
*   **Styling:** Height `0.5` (0.1rem) for a sleek, "hairline" look, or `2` (0.4rem) for data-heavy visualizations.

### Glassmorphism Cards
*   Used for "Quick Stats" overlays. 
*   **Background:** 80% opacity `surface-container-lowest`.
*   **Edge:** A 1px "Ghost Border" of `outline-variant` at 10% opacity to catch the light.

### Departmental Icons
Each department icon should be paired with a specific color from the extended palette:
*   **Waldent & Operations:** `primary`
*   **Logistics & Supply Chain:** `secondary`
*   **Digital Marketing & Content:** `tertiary`
*   **Accounts:** `on-secondary-container`

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a separator. Use `10` (2.25rem) or `12` (2.75rem) from the spacing scale between major dashboard modules.
*   **DO** use "surface-tint" (#0056d2) for interactive states like focused input fields or active navigation tabs.
*   **DO** ensure all Glassmorphism layers have a `backdrop-filter` for legibility.

### Don't
*   **DON’T** use dividers or lines to separate list items. Use a `2.5` (0.5rem) vertical gap and a subtle background change on hover.
*   **DON’T** use pure black for text. Use `on-surface` (#191c1e) to maintain the sophisticated slate-gray tone.
*   **DON’T** use sharp corners. Stick to the `lg` (0.5rem) and `xl` (0.75rem) roundedness scale to keep the interface feeling approachable and modern.

---

## 7. Spacing & Grid Logic
Avoid the "Standard Grid." Use **The 4-Column Asymmetric Anchor**:
*   **Columns 1-3:** Content and Data Visualizations.
*   **Column 4:** Quick-Action sidebar and Departmental navigation.
*   Use the Spacing Scale `16` (3.5rem) for outer page margins to give the content "room to breathe."