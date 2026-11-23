# Work log

## Owner actions (open)
- [x] Create GitHub repo `calcdock` (done 2026-11-23).
- [x] Pages enabled via GitHub Actions. Site is live at https://wolwoltje68.github.io/calcdock/ (2026-11-23).
- [ ] Google Search Console: add the site and submit `/sitemap.xml`.
- [ ] Apply for Google AdSense once the site has ~20+ quality pages and some traffic. Put the `ca-pub-…` id in `site.config.mjs`.
- [ ] **Custom domain (~€10/yr). Effectively required for AdSense** (github.io subpaths are not accepted). Then update `baseUrl`.

## 2026-11-23 — v1
- Built a static site generator (`build.mjs`), language-neutral tools plus per-language text (`src/tools.mjs`, `src/i18n.mjs`).
- 10 calculators in EN + NL (26 pages): percentage, discount, VAT, compound interest, loan, hourly↔salary, days between dates, age, BMI (metric/imperial), weighted grade.
- SEO: canonical, hreflang, sitemap with alternates, JSON-LD (WebApplication, FAQPage, BreadcrumbList), robots.txt.
- Ads: AdSense auto-ads and ads.txt are generated automatically once `adsenseClient` is set.
- Smoke test (`npm test`): loads every page in Chromium and checks for JS errors and NaN output.
- Next: German translation of all tools (largest non-English calculator market in the EU).

## 2026-11-23 — deploy fix
- Switched to the standard two-job Pages workflow (upload-pages-artifact@v4 + deploy-pages@v4). The first deploy failed with 'No artifacts named github-pages'. Now green; site is live.
