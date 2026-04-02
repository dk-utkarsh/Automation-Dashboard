# Design System Documentation: The Kinetic Anchor

## 1. Overview & Creative North Star
**The Creative North Star: "The Kinetic Anchor"**

This design system is engineered to bridge the gap between high-velocity energy and enterprise-grade stability. We are moving away from the "standard dashboard" template. Instead, we embrace an editorial approach characterized by **Kinetic Tension**—using the vibrant heat of Orange (`primary`) against the deep, immovable weight of Navy (`secondary`).

The layout philosophy rejects the rigid, boxed-in grid. We utilize intentional asymmetry, extreme typographic contrast, and "Tonal Layering" to guide the user’s eye. The interface shouldn't feel like a software tool; it should feel like a high-performance flight deck: precise, authoritative, and sophisticated.

---

## 2. Colors & Surface Philosophy
The palette is a dialogue between light and depth. Orange provides the "Kinetic" pulse for actions, while Navy acts as the "Anchor" for navigation and structure.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off the UI. Containers must be defined strictly through background color shifts. 
*   Use `surface` (#82756b) as your base canvas.
*   Use `surface-container-low` (#f3f4f5) to carve out secondary zones.
*   Use `surface-container-lowest` (#ffffff) for primary content cards to make them "pop" against the gray canvas.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. An inner component (like a data table) should sit on a `surface-container-highest` (#e1e3e4) if it needs to draw the eye, or `surface-container-low` to recede. This "nested depth" replaces the need for cluttered divider lines.

### The "Glass & Gradient" Rule
To elevate the "out-of-the-box" feel:
*   **Floating Elements:** Use `surface_container_lowest` at 85% opacity with a `24px` backdrop-blur for modals and dropdowns.
*   **Signature Textures:** Main CTAs or high-impact hero sections should utilize a subtle linear gradient from `primary` (#d47b02) to `primary_container` (#d47b02) at a 135-degree angle. This adds "soul" and prevents the orange from feeling flat or "cheap."

---

## 3. Typography
We use **Inter** not just for legibility, but as a structural element. 

*   **Display & Headline:** These are your "Statement" tiers. Use `display-lg` (3.5rem) with a `letter-spacing: -0.02em` for dashboard overviews. The high contrast between massive headlines and small, precise labels creates an editorial, premium feel.
*   **Title & Body:** `title-md` (1.125rem) is the workhorse for card headers. Ensure `body-md` (0.875rem) maintains a line-height of 1.5 to provide breathing room.
*   **Labels:** `label-sm` (0.6875rem) should always be in `on-surface-variant` (#564334) and potentially Uppercase with `0.05em` tracking to denote technical data points.

---

## 4. Elevation & Depth
In this system, depth is a result of light physics, not CSS defaults.

### The Layering Principle
Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "Soft Lift."

### Ambient Shadows
Shadows are reserved only for elements that literally "float" (Modals, Tooltips). 
*   **The Shadow Formula:** Use large blurs (32px to 64px) at very low opacities (4-8%).
*   **The Tint Rule:** Never use pure black for shadows. Use a tinted version of `secondary` (#9b6d42) at 10% opacity to create a natural, ambient occlusion that feels integrated with the navy anchor.

### The "Ghost Border" Fallback
If a boundary is required for accessibility in dense data views, use a **Ghost Border**: The `outline-variant` (#ddc1ae) token set to **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), white text, `lg` (0.5rem) roundedness.
*   **Secondary:** Ghost style. No fill, `secondary` (#9b6d42) text, and a `Ghost Border` that turns opaque on hover.
*   **Tertiary:** Pure text using `secondary` with a bold weight.

### Cards & Lists
*   **Constraint:** Zero dividers. 
*   **Implementation:** Separate list items using `spacing-4` (1rem) of vertical white space. Use `surface-container-low` for the hover state of a list item to indicate interactivity.

### Input Fields
*   **Resting State:** `surface-container-high` background with no border.
*   **Focus State:** Background shifts to `surface-container-lowest` with a 2px `secondary` (#9b6d42) "Ghost Border" and a subtle glow.

### Kinetic Progress Indicators
For a dynamic dashboard feel, progress bars should use a `primary` (#d47b02) base with a glowing `primary-container` (#d47b02) leading edge to simulate movement and energy.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetric Margins:** Give more breathing room to the left of a headline than the top to create a modern, editorial rhythm.
*   **Layer Surfaces:** Use the `surface-container` tiers to create hierarchy.
*   **Leverage High Contrast:** Ensure `on-primary` (White) is always used against the orange for maximum energy.

### Don't:
*   **Don't use 1px solid borders.** This is the quickest way to make the design look like a legacy enterprise tool.
*   **Don't use pure gray shadows.** It muddies the vibrant orange/navy interaction.
*   **Don't clutter the space.** If a component feels crowded, increase the spacing using the `spacing-8` (2rem) or `spacing-10` (2.5rem) tokens. This system thrives on "white space as a feature."