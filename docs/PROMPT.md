# Omega Map Devices — Project Prompt

Purpose
- Build a clear, maintainable React + TypeScript app that shows device clusters on a Leaflet map and renders a system diagram inside a full-screen Ant Design modal.

Core principles
- Maintainability first: data-driven rendering for the system diagram (nodes + edges arrays). Avoid large, hand-drawn SVG blocks.
- Clarity: orthogonal wiring, spacing, no overlapping wires over cards, and readable labels.
- Safety: no secrets in code, no unused dependencies, follow ESLint rules, and type everything.

Tech stack
- React 19 + TypeScript 5 + Vite 6
- Ant Design 5 for UI (Modal in particular)
- Leaflet + MarkerCluster for the map
- CSS Modules for component styles

UI/UX rules to follow
- Device modal
  - Use AntD Modal full-screen. Title is the device name.
  - Wrap the SVG in a horizontally scrollable container (overflow-x: auto). Keep vertical scroll minimal.
- Diagram styling
  - Wires are green (#39d16a). Bus width: 12px; taps: 7px. Rounded caps and joins.
  - Orthogonal routing (L-shaped). Wires connect to the card edges (left/right centers), not across the card.
  - Draw order: edges (wires) → nodes (cards/images) → ports/junctions (small green dots) so ports stay visible.
  - Standardize card sizes and align on rows/columns for a clean layout.
  - Use `SystemDiagram.tsx` with nodes/edges arrays; do not reintroduce static, monolithic SVG.
- Map seams
  - Prevent white seams between Leaflet tiles by ensuring tile background is transparent and enabling 3D transform hints.
  - Escalation path: CSS light fix → negative margin overlap (only if needed) → review tileSize/detectRetina options.

Engineering rules
- TypeScript
  - No `any`. Create minimal domain types (e.g., NodeDef, EdgeDef).
  - Keep helpers pure and small; colocate diagram helpers in `SystemDiagram.tsx`.
- React
  - Function components with hooks. Avoid implicit `any` in props.
  - Prefer composition over prop drilling. Re-export index files under folders.
- CSS
  - Use CSS Modules in `component.module.css`. Keep global CSS minimal.
  - Avoid z-index wars: control draw order via render order for SVG.
- Linting
  - Must pass `npm run lint` with ESLint v9 config in the repo.

Quality gates (must pass before merge)
1) Build: `npm run build` completes without errors.
2) Lint: `npm run lint` reports no errors (warnings allowed only if intentionally documented).
3) Smoke test: `npm run dev` starts; modal opens; diagram renders with correct topology; map loads without white tile seams.
4) Screenshots: include before/after for any UI change in PR.

Topology rules for the diagram
- Sources: 3-phase + Generator merge at REC.
- PV → MPPT.
- MPPT + REC → Inverter → main bus → Tower/Load.
- Battery and 24V cabinet are taps from the main bus.

Accessibility
- Provide alt text for images in cards where appropriate.
- Ensure color contrast for labels over cards (dark text on white).

Security
- Do not commit secrets or tokens. Use environment variables and local `.env` not checked in.
- Do not log sensitive payloads.

Performance
- Avoid heavy libraries for simple tasks. Stick to the current stack.
- Keep SVG paths minimal; no unnecessary filters. One drop shadow filter per diagram is acceptable.

AI assistant usage
- Keep code small, typed, and aligned with the above rules.
- When asked for your name, respond "GitHub Copilot".
