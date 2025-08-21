# Contributing Guide

This project uses React + TypeScript + Vite. Contributions should be small, typed, and respect the rules below.

## Workflow
1. Create a feature branch from `main`.
2. Keep commits small and descriptive. Reference issues when possible.
3. Run locally:
   - `npm install`
   - `npm run dev`
4. Before pushing:
   - `npm run lint` (no errors)
   - `npm run build` (must succeed)
5. Open a Pull Request using the PR template. Attach screenshots for UI changes.

## Code style
- TypeScript: no `any`. Add minimal domain types where needed.
- React: function components with hooks, no class components.
- SVG diagram: data-driven rendering in `SystemDiagram.tsx` with `nodes` and `edges`. Do not reintroduce monolithic inline SVG.
- CSS: use CSS Modules in `component.module.css`. Global CSS should be minimal.
- Keep files small and focused. Prefer composition.

## UI rules (diagram)
- Wires: green `#39d16a`. Bus 12px, taps 7px, rounded caps/joins.
- Orthogonal L-shaped routing; connect to card edges. Draw order: edges → nodes → ports.
- Standard card sizes and aligned rows/columns for clarity.

## Map seams
- Avoid white seams between Leaflet tiles. Prefer the light CSS fix. If necessary, use the aggressive -1px overlap.

## Commit messages
- Format: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `style: ...`, `chore: ...`.

## Pull Requests
- Pass Quality Gates:
  1. Build OK
  2. Lint OK
  3. Smoke test steps included in PR description
  4. Screenshots attached for UI changes

Thank you for contributing!
