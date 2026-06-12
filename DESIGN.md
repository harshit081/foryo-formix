# Foryo Formix Design System Specification

This document details the extracted design tokens, typography scales, layout rules, and style specifications for the **Foryo Formix** product ecosystem, retrieved from the Stitch Design Workspace.

---

## 🎨 Color Palette & Themes

Foryo Formix utilizes a premium color theme centered around the concept of **"Flow"**—representing the transition of raw data into actionable insights.

### 1. Primary Brand Gradients
These colors represent the Foryo Ecosystem spark logo (Insight, Discovery, Completion, Connected Workflows) and are used for primary brand moments, gradients, progress indicators, and active flow paths.

| Brand Token | Hex Code | Visual / Description |
| :--- | :--- | :--- |
| `gradient-start` | `#6D5EF9` | **Purple** (Start of workflow, Insight) |
| `gradient-mid-1` | `#A855F7` | **Violet** (Discovery) |
| `gradient-mid-2` | `#EC4899` | **Pink** (Completion) |
| `gradient-mid-3` | `#FF6B6B` | **Coral** (Warm alert / Pending state) |
| `gradient-end` | `#14B8A6` | **Teal** (Completion, Connected workflows) |

### 2. Functional & Neutral Colors
These colors provide semantic signals (success, error) and structural contrast across components.

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| `primary` | `#5442df` | Main Brand/Interactive Color |
| `primary-container` | `#6d5ef9` | Primary Hover / Accents |
| `secondary` | `#b4136d` | Accent / Highlight |
| `secondary-container` | `#fd56a7` | Alert / Visual Accents |
| `tertiary` | `#006a5e` | Success / Completion State |
| `tertiary-container` | `#008577` | Success BG/Indicator |
| `error` | `#ba1a1a` | Failure / Error Indicator |
| `error-container` | `#ffdad6` | Error Background |
| `on-background` | `#141b2b` | Dark Slate (Primary Text) |
| `on-surface-variant` | `#474555` | Secondary text |

### 3. Surface & Background Tokens
The theme is designed to work seamlessly in both light mode and dark mode variations.

* **Light Mode Backgrounds**:
  * Main Canvas / Primary Card BG: `#FFFFFF` (pure white for maximum contrast and clarity)
  * Secondary Surfaces (Sidebar/Header): `#FAFAFA`
  * Outer Background Container: `#F7F8FA`
  * Surface Tint: `#f9f9ff`
* **Dark Mode Backgrounds**:
  * Main Canvas / Background: `#111827` (slate-900)
  * Secondary surfaces: `#1c1c1e` / `#1f2937`
  * Overlay containers: `rgba(20, 22, 33, 0.7)` (Glassmorphism backdrop)

---

## 🔤 Typography Scale

Typography is designed to feel **confident and grounded**. Light text weights are avoided to maintain readability and impact.

* **Primary Typeface**: `Inter` (neutral, modern, legible)
* **Display Typeface**: `Outfit` / `Inter` (heavy, geometric)

| Style | Font Family | Font Size | Font Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Inter | `64px` | `800` (Extra Bold) | `72px` | `-0.04em` |
| `headline-lg` | Inter | `40px` | `700` (Bold) | `48px` | `-0.02em` |
| `headline-lg-mobile` | Inter | `32px` | `700` (Bold) | `40px` | `-0.02em` |
| `headline-md` | Inter | `24px` | `600` (Semi Bold) | `32px` | `0` |
| `body-lg` | Inter | `18px` | `400` (Regular) | `28px` | `0` |
| `body-md` | Inter | `16px` | `400` (Regular) | `24px` | `0` |
| `label-md` | Inter | `14px` | `600` (Semi Bold) | `20px` | `0.01em` |
| `label-sm` | Inter | `12px` | `700` (Bold) | `16px` | `0.05em` |

---

## 📐 Layout & Spacing Rules

The layout philosophy emphasizes **spatial abundance** and a **"Card-First"** modular flow.

- **Grid Model**: 12-column fixed grid for desktop (1200px content width) centered within a 1440px viewport. Gutters are configured to a standard `24px`. On mobile, margins shrink to `16px`.
- **Rhythm Scale**:
  - `space-xs`: `8px`
  - `space-sm`: `16px`
  - `space-md`: `24px`
  - `space-lg`: `32px`
  - `space-xl`: `48px`
  - `space-2xl`: `64px`
  - `space-3xl`: `96px`
  - `space-4xl`: `128px`

---

## 🖼️ Shapes, Elevation & Depth

- **Approachability**: Soft, curved approach without sharp corners:
  - Inputs/buttons: `14px` radius (`rounded-[14px]`).
  - Cards: `20px` radius (`rounded-[20px]`).
  - Tags, chips, indicators: Fully rounded pill-shape (`rounded-full`).
- **Depth Layers**:
  - **Glassmorphic panels**: Backdrop blur of `12px` (`backdrop-blur-md`) with a `1px` translucent border (`border-white/8`).
  - **Tonal Layers**: The primary content canvas is white. Secondary components sit on off-white or gray background layers (`#FAFAFA` / `#F7F8FA`).
  - **Tactile Hover**: Elevated components hover-lift up by `4px` with soft, low-opacity shadows (`0 8px 30px rgba(0,0,0,0.04)`).

---

## 📦 Component Guidelines

### 1. Buttons
- **Primary Button**: Gradient fill (Purple → Pink → Teal) with white text. Height: `48px`. Radius: `14px`.
- **Secondary Button**: 1px border outline (`#E5E7EB`) with `#111827` text. Height: `48px`. Radius: `14px`.

### 2. Cards
- **Form/Response Nodes**: `20px` radius, white background, soft hover-lift, subtle `1px` border.
- **Analytics Metric Panels**: Bold metrics, using the Primary Gradient colors for active indicators and trend bars.

### 3. Inputs
- **Text/Selection Fields**: Height: `48px`. Radius: `14px`. Border color: `#E5E7EB`.
- **Active Focus**: `2px` outline using Foryo Purple (`#6D5EF9`) with a soft glow effect.
