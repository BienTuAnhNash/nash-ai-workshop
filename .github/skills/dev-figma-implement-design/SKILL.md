---
name: dev-figma-implement-design
description: Translate a Figma design into production code with 1:1 visual fidelity, using the Figma MCP server to pull design context, screenshots, and assets. Use only when a Figma URL is explicitly provided, or when a node is selected in the Figma desktop app and the user asks to implement, build, or generate code for that design.
metadata:
  mcp-server: figma, figma-desktop
---

# Dev — Implement a Figma Design

## Prerequisites

- A **Figma MCP server** is connected. Without it, this skill can't run — say so rather than guessing at the design.
- Either a Figma URL in the form `https://figma.com/design/:fileKey/:fileName?node-id=1-2`, **or** the `figma-desktop` MCP with a node selected in the open file.
- Ideally, an existing design contract (`DESIGN.md`) or component library in the project to map tokens onto.

> If your pod has no Figma file, skip this skill entirely and implement from the BA's wireframes and GUI spec instead.

## Workflow

Follow the steps in order.

### 1. Get the node ID

**From a URL:** the file key is the segment after `/design/`; the node ID is the `node-id` query parameter.

Example — `https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15` → fileKey `kL9xQn2VwM8pYrTb4ZcHjF`, nodeId `42-15`.

**From the desktop app:** with the `figma-desktop` MCP, no `fileKey` is passed — the server uses the currently open file and selected node.

### 2. Fetch design context

```
get_design_context(fileKey=":fileKey", nodeId=":nodeId")
```

This returns layout (auto-layout, constraints, sizing), typography, colours and tokens, component structure and variants, spacing.

**If the response is truncated:** run `get_metadata` for the high-level node map, pick the child nodes you actually need, then call `get_design_context` per child.

### 3. Capture the visual reference

```
get_screenshot(fileKey=":fileKey", nodeId=":nodeId")
```

Keep this accessible — it's the source of truth for validation in step 6.

### 4. Download assets

Take images, icons, and SVGs from the Figma payload.

- If the MCP returns a `localhost` source, use it directly.
- Do **not** add new icon packages — assets come from the payload.
- Do **not** substitute placeholders when a real asset is available.

### 5. Translate to project conventions

Treat the MCP output (usually React + Tailwind) as a description of design and behaviour, **not** as final code style.

- Replace generated utility classes with the project's own styling approach and tokens.
- Reuse existing components (buttons, inputs, typography, icon wrappers) rather than duplicating them.
- Respect the project's routing, state management, and data-fetching patterns.
- Where design-system tokens and Figma values conflict, prefer the tokens and adjust spacing minimally to preserve the look.
- Avoid hardcoded values; add types for component props.

### 6. Validate against the screenshot

- [ ] Layout matches — spacing, alignment, sizing
- [ ] Typography matches — family, size, weight, line height
- [ ] Colours match
- [ ] Interactive states behave as designed (hover, active, focus, disabled)
- [ ] Responsive behaviour follows the Figma constraints
- [ ] Assets render
- [ ] Accessible — keyboard reachable, sufficient contrast, labelled controls

Validate as you go, not only at the end. Document any deliberate deviation (accessibility, technical constraint) in a code comment.

## Common issues

| Symptom                         | Cause                                     | Fix                                                                                                    |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Output truncated                | Design too deeply nested for one response | `get_metadata` first, then fetch child nodes individually                                              |
| Result doesn't match the design | Values assumed rather than read           | Compare side by side with the step-3 screenshot; re-read spacing/colour values from the design context |
| Assets don't load               | Asset URLs rewritten                      | Use the MCP's `localhost` URLs unmodified                                                              |
| Token values differ from Figma  | Project tokens have their own scale       | Keep project tokens; adjust spacing/size to hold visual fidelity                                       |
