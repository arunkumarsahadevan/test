
# GitHub Pages package: **Tickets Dashboard**

This package contains everything you need to publish a static dashboard on GitHub Pages that **auto‑loads `tickets.json`** and displays KPIs + a table. No build step required.

## Files
- `index.html` — single‑file app that fetches `./tickets.json` (using a project‑page‑safe relative URL) and renders KPIs and a table. Also supports a **Reload** button and **30‑second auto‑refresh**.
- `tickets.json` — sample data (array at the root). Replace with your real data.
- `.nojekyll` — disables Jekyll processing (keeps paths exact).
- `.github/workflows/pages.yml` — GitHub Actions workflow that **publishes automatically** to GitHub Pages on each push to `main`.

## How to use
1. Create a new repository (or use your existing one).
2. Copy the contents of this package into the repo root and commit to **main**.
3. **Enable Pages**: the included workflow will deploy to the `github-pages` environment and a `gh-pages` branch automatically.
   - After the first push, check **Actions** → the job named *Deploy static site to Pages* should complete.
   - Then go to **Settings → Pages** to see your **site URL**.
4. Open your site URL. You should see the dashboard. It will auto‑fetch `tickets.json` from the same folder.

### Update data
- Replace `tickets.json` with your latest data (must be **an array** of objects). Push to `main`. The site updates after the workflow finishes.

### Troubleshooting
- If you open `tickets.json` URL directly and see **HTML** (404 page) rather than JSON, ensure the file is in the same folder as `index.html` and the workflow has deployed the latest commit.
- If the page appears stale, wait a minute for CDN propagation. The app also cache‑busts requests using `?ts=<timestamp>` and `{ cache:'no-store' }`.

## Alternative (no Actions)
If you prefer not to use Actions, you can instead set **Settings → Pages → Source = main / (root or /docs)** and omit the workflow. Then just place `index.html` and `tickets.json` in that folder.

