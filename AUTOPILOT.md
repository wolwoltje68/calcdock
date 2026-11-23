# Autopilot playbook

This file tells the scheduled Claude session what to do on every run. Read it fully before making changes.

## Goal
Grow organic search traffic to a multilingual site of free online calculators, and earn from display ads (Google AdSense).
Success metric: indexed pages × search impressions × clicks. Revenue follows traffic.

## Why this strategy
- Calculators answer evergreen, high-volume queries ("percentage calculator", "btw berekenen", "Prozentrechner").
- Each page is a genuinely useful tool, not mass-produced text. That keeps it within Google's spam policies (scaled content abuse) and AdSense quality rules.
- Every new language multiplies reach for the same code. Non-English markets have less competition.
- Hosting is free (GitHub Pages), so the only cost is a domain (optional, ~€10/year).

## Every run, in this order
1. `git pull`. Read `LOG.md` (the last 10 entries) and `site.config.mjs`.
2. Check the **Owner actions** section of `LOG.md`. Never pretend those are done. Re-list any open ones in your final message.
3. Pick **one or two** items from the backlog below, highest priority first. Prefer finishing over starting.
4. Implement them. Follow the quality rules.
5. Run `npm test`. It must print no `FAIL`. Fix until it does.
6. Append an entry to `LOG.md`: date, what you did, which pages were added, and your idea for next time.
7. Commit with a clear message and push to `main`. The GitHub Action deploys automatically.

## Quality rules (non-negotiable)
- Every calculator must compute correctly. Verify formulas with a worked example in the page text and with the test.
- Write unique, helpful explanatory text per language. Write natively, not as a literal translation. Do not pad. 150–400 words is fine.
- Never invent statistics, laws, tax brackets or rates you cannot verify. If a figure changes yearly (tax brackets, minimum wage), only add it when you have a verified source from that year, and show "last checked" with the year.
- Health and finance pages carry a short disclaimer. Never give personalised advice.
- No fake reviews, no fake authors, no copied content, no keyword stuffing, and no cloaking.
- Do not publish thin near-duplicate pages, for example 100 pages like "what is 15% of 200". At most, add a few useful example tables inside a tool page.
- Keep pages fast: no frameworks and no external JS other than AdSense/analytics.
- Do not add tools whose output could cause real harm if wrong (medication dosing, etc.).

## Track B: browser games (distributed via CrazyGames, also hosted on the own site)
- Games live in `games/<name>/` (index.html + core.js + game.js). Rules live in core.js and are pure, so they can be tested and simulated.
- Every game needs: a balance check with a bot (`sim.mjs`), a Chromium play test (`node games/test-game.mjs games/<name>`), and no JS errors.
- Build a release with `node games/build-games.mjs --release && node games/make-covers.mjs`. This produces `release/` (gitignored), which the owner uploads.
- Platform hooks: use the `P` adapter in game.js (CrazyGames SDK v3: loadingStop, gameplayStart/Stop, happytime, midgame ads only between levels). The game must run normally without the SDK.
- Only original games: no clones of named games, their art or names. No external links inside the game.
- Ideas: improve Cascade Pop (daily challenge, level map, more specials, then localise the UI), then build new original games in proven genres: block-fit puzzle, idle merge, one-tap arcade, word puzzle.
- Alternate: one run on calculators, the next run on games.

## Backlog (top = next)
1. Languages: add **German (de)** to all tools, then **Spanish (es)**, **French (fr)**, **Portuguese (pt-BR)**, **Italian (it)** and **Polish (pl)**. Add the entry in `src/i18n.mjs` with locale, currency and dir, plus a `text.<lang>` block per tool. Use local slugs (de: `prozentrechner`, `mehrwertsteuer-rechner`, `zinseszinsrechner`, ...).
2. New evergreen tools, all languages:
   - unit converter (length, weight, temperature, volume)
   - tip calculator
   - fuel cost / fuel consumption (L/100km ↔ mpg)
   - time duration / hours worked calculator
   - mortgage affordability
   - savings goal (how long until X)
   - inflation calculator (only with verified CPI data, otherwise skip)
   - random number / dice
   - word & character counter
   - password generator (client-side)
   - pregnancy due date (with disclaimer)
   - calorie/BMR (Mifflin-St Jeor, with disclaimer)
   - GPA calculator
   - fraction calculator
   - scientific notation
   - Roman numerals
   - time zone converter
   - countdown to holidays
3. Per-tool improvements: shareable URL with inputs (query string), a chart for compound interest/loan, an amortization table, print styles.
4. SEO: internal links between related tools, unique OG images (SVG to PNG at build time), and `lastmod` only when content changes.
5. Once the owner has set `adsenseClient`: verify `ads.txt`, check that ad placement does not hurt usability (auto ads only), and keep the consent message enabled in AdSense (EU/UK).

## Things only the owner can do
These require identity, payment or account ownership. List them, never fake them:
- Create the GitHub repo and enable Pages (Settings → Pages → Source: GitHub Actions).
- Optional: buy a domain and point it to GitHub Pages, then set `baseUrl`.
- Verify the site in Google Search Console and submit `sitemap.xml`.
- Apply for Google AdSense. This needs a name, address and bank account. Then put the publisher id in `site.config.mjs` and enable the "Privacy & messaging" consent message for the EEA/UK.
- Optional: a free GoatCounter account for cookieless analytics, then set `analytics`.
