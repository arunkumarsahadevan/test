
# Helpdesk Performance Dashboard (7 visuals)

Static, client‑side dashboard that **auto‑reads `tickets.json`** from the same folder and **refreshes every 30 seconds**. Built with **Plotly.js v3** from the official CDN and safe relative URL resolution for GitHub Pages project sites.

## How to deploy (GitHub Pages)
1. Create or open a repository.
2. Copy these files to the **repository root** and commit to **main**:
   - `index.html` (dashboard)
   - `tickets.json` (your data; must be a **JSON array**)
   - `.nojekyll`
   - `.github/workflows/pages.yml` (optional; auto‑publishes with Actions)
3. After the Action finishes, open **Settings → Pages** to find your site URL.
4. Verify that `https://<user>.github.io/<repo>/tickets.json` shows **raw JSON**. The page fetches it using `new URL('./tickets.json', location.href)`; this keeps the request under your project path (e.g., `/myrepo/…`).

> Plotly recommends using an explicit CDN version (e.g., `plotly-3.4.0.min.js`) because **`plotly-latest.min.js` is frozen at v1.58.5** and no longer updated for v2+; this package pins v3.4.0. [[Plotly docs]](https://plotly.com/javascript/getting-started/) [[Issue note]](https://github.com/plotly/plotly.js/issues/7315)

## Data expectations
- Root must be a **JSON array** of ticket objects.
- Common fields used:
  `Ticketid`, `Customername`, `ProjectName`, `CurrentStatus`, `NewgenSeverity`, `Subject`,
  `ReportingTime`, `FirstResponseTime`, `ClosingDate`, `UserEnvironmentType`, `Support_Scope`,
  `Newgen Issue Sub Category`, `Problem Type (Newgen)`, `Problem Type (Customer)`, `Response_TicketSLAMet`, `Resolution_TicketSLAMet`, `AssigntoUserName`.
- Date formats: `dd-MMM-yyyy HH:mm:ss` (e.g., `07-Mar-2026 10:12:30`) or ISO strings parseable by browsers.

## The seven visuals
1) **Ticket Volume Trend** — line + markers (daily counts)
2) **Ticket Distribution by Problem Type** — vertical bar, source switcher (Newgen/Customer)
3) **SLA Compliance Rate** — two donut pies (Response vs Resolution)
4) **Ticket Distribution by Severity** — vertical bars for S1/S2/S3
5) **Top Customers/Projects** — vertical bar with Top‑N and radio toggle
6) **Resource‑wise Weekly Closed Tickets** — Plotly table computed from selected start date and week window
7) **Filtered Tickets (table view)** — sticky header native table

## Tips
- If you see HTML instead of JSON in the console, `tickets.json` is missing or not in the published folder. Place it **next to `index.html`** and republish.
- The app appends `?ts=<timestamp>` and uses `{ cache:'no-store' }` to avoid stale caches.

