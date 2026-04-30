# NailBot · Web Dashboard

React + TypeScript dashboard for **NailBot**, the robotic nail-painting system
described in `../../README.md`. It is the supervisory & logging UI from the
project's vertical stack (Layer 3–4): session logs, performance metrics,
requirements vs actuals, model retraining pipeline, and hardware status.

## Stack

| Concern        | Choice                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Framework      | React 18 + TypeScript (strict)                                         |
| Build          | Vite 5                                                                 |
| Styling        | Tailwind CSS + CSS variables (NailBot pink/burgundy palette)           |
| Components     | shadcn/ui-style primitives (Radix + class-variance-authority) inlined  |
| Routing        | React Router v6                                                        |
| Charts         | Recharts                                                               |
| Icons          | lucide-react                                                           |
| Mock data      | `src/data/mock-*.ts`, served through `src/lib/api.ts`                  |

## Quick start

```bash
cd apps/web
npm install
npm run dev
```

The dev server prints a URL (usually <http://localhost:5173>). Hot reload
is on. Other scripts:

```bash
npm run build      # tsc -b && vite build
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Folder layout

```
apps/web
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── src
    ├── main.tsx                  # app entrypoint, React Router
    ├── App.tsx                   # route table
    ├── index.css                 # design tokens + tailwind layers
    ├── components
    │   ├── ui/                   # shadcn-style primitives (button, card, …)
    │   ├── layout/               # Sidebar, Topbar, MobileNav, DashboardLayout
    │   ├── dashboard/            # MetricCard, StatusPill, PageHeading
    │   └── charts/               # chart palette + tooltip styling
    ├── pages
    │   ├── Overview.tsx
    │   ├── Sessions.tsx
    │   ├── Performance.tsx
    │   ├── Requirements.tsx
    │   ├── Pipeline.tsx
    │   ├── Hardware.tsx
    │   └── NotFound.tsx
    ├── data/                     # typed mock fixtures
    ├── lib
    │   ├── utils.ts              # cn() + formatters
    │   └── api.ts                # API client (mock today, /api/* tomorrow)
    ├── hooks
    │   └── useApi.ts
    └── types
        └── index.ts              # domain types: RobotState, SessionLogEntry, …
```

## Connecting the FastAPI backend

The frontend already speaks the contract. To wire it up:

1. Stand up the backend at `http://localhost:8000` (e.g. `apps/api` or
   `backend/api` containing a FastAPI app that imports `nailbot/`).
2. Uncomment the `proxy` block in `vite.config.ts` so `/api/*` is forwarded.
3. Set `USE_MOCKS = false` in `src/lib/api.ts`.
4. Match the route shapes documented as comments in `src/lib/api.ts`
   (`GET /api/overview`, `GET /api/sessions`, `GET /api/metrics/*`, …).

No component imports `data/mock-*` directly — every page consumes the typed
client, so swapping it out requires no UI changes.

## Pages

| Route             | Purpose                                                                    |
| ----------------- | -------------------------------------------------------------------------- |
| `/`               | Overview — live state pill, current session, last run, health, safety     |
| `/sessions`       | Session logs — searchable, filterable history with metrics + outcome      |
| `/performance`    | Performance — boundary, thickness, cycle time, repeatability charts       |
| `/requirements`   | Requirements vs Actual — Phase 1C spec table with attainment radar         |
| `/pipeline`       | Model & retraining — dataset stats, version history, readiness, queue     |
| `/hardware`       | Hardware — motors, camera, end-effector, sensors, calibration, events     |

## Design notes

The palette is derived from the project's slide deck.

| Token              | HSL                | Hex (approx)  | Usage                          |
| ------------------ | ------------------ | ------------- | ------------------------------ |
| `--nailbot-blush`  | `348 60% 90%`      | `#F3D5DA`     | canvas wash                    |
| `--nailbot-pink`   | `348 50% 83%`      | `#E8BFC6`     | cards, soft accents            |
| `--nailbot-rose`   | `344 51% 70%`      | `#D88FA0`     | charts, secondary actions      |
| `--nailbot-mauve`  | `344 30% 50%`      | `#A85B6E`     | mid-tone accents               |
| `--nailbot-burgundy` | `340 39% 26%`    | `#5C2A37`     | headlines, primary CTA         |
| `--nailbot-plum`   | `340 50% 11%`      | `#2A0E1A`     | dark slabs (e.g. readiness)    |
| `--nailbot-cream`  | `38 35% 84%`       | `#E8DCC4`     | neutral chip / chart secondary |
