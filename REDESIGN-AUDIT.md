# Redesign Audit — ai-venture-hub ("The Dispatch")
Date: 2026-10-13 · Worker: batch-hubs

## Competitors researched
1. **Product Hunt** — ranked leaderboard rows (rank #, icon, name + tagline, topic tags, save/upvote, comment count), collection pages, per-product detail pages with related launches.
2. **Y Combinator Startup Directory** — company cards with one-liner + industry tags + batch badges; faceted search + sort; infinite scroll directory feel.
3. **AppSumo collections** — category rails, deal cards with rating + social proof, sticky filter bar.
4. **BetaList** — curated "new drops" editorial framing; minimal, typography-led.

## Visual gaps (current state)
- Blue gradient hero (`linear-gradient(135deg, #0f1c33, #1e3a8a, #2563eb)`) — banned by the no-gradient rule; looks template-default.
- Hub cards are dark rounded slabs (`border-radius: 14px`) with a cramped wall of "·"-separated member links — no hierarchy, violates the no-rounded-edges rule.
- Product list is a flat bordered list with tiny copy-link buttons floating right — no Product-Hunt-style leaderboard anatomy (no ranks, no visual rhythm).
- System-default typography, no display/serif identity; every other hub looks identical in tone.
- No hub identity colors — tags are all blue outline pills.
- "Search 54 products…" placeholder is hardcoded (stale the day a product ships).

## Functional gaps (vs competitors)
- **No product detail view.** Every row is just an outbound link. PH/YC/AppSumo all have a per-product page/panel with more info + related items. Clicking a name navigates away with zero context.
- **Discovery is search-only.** No browse-by-hub chips, no "featured/spotlight", no related-products cross-linking.
- **Index is stale:** 54 products listed; voice-memory, decisiontune-ai, callrecall-ai (shipped 2026-10-13) are missing from "All products".
- Favorites are invisible — no saved count in the masthead; saved-only toggle is buried in the finder bar.
- Sort "by hub" renders a flat list with tiny tags instead of grouped leaderboard sections.

## Flow gaps
- Hub cards bury the hub's own dashboard link ("Open hub →" below a link soup); the natural path "browse hub → scan its tools → open one" has no detail step.
- No Escape-to-clear on the finder; no keyboard flow for power users beyond "/".

## Plan (this redesign)
1. **Identity: "The Dispatch"** — editorial broadsheet. Cream paper (#faf7f1), ink (#171410) serif display (Georgia/Charter stack), one accent: burnt orange (#c2410c). Sharp corners everywhere. Masthead topbar with wordmark + dateline + saved count; 1px ink rules as section dividers.
2. **Leaderboard rows:** rank number, save star, name + tagline, hub chip in per-hub ink color, "Details" (opens modal) + "Repo" links. `hub-card`/`hub-tag`/`copy-link`/`spotlight`/`data-fav` markers preserved for tests.
3. **Product detail modal (PH-style):** tagline, hub, related tools (same hub), Save, Copy link, Open repo. Closes on Esc/backdrop.
4. **Sticky finder command bar:** search (dynamic placeholder "Search 57 products…"), hub chips (All + 4 hubs) replacing the dropdown, sort select, Saved toggle with count, Surprise me. "/" focuses, Esc clears.
5. **Data update:** add voice-memory, decisiontune-ai, callrecall-ai (no hub membership — honest "unfiled" tools).
6. **Bug fix:** none functional found; placeholder staleness fixed by computing count from data.
7. Tests: update 54→57 assertions; add coverage for modal-related helpers + un-hubbed products in sort-by-hub (rendered last).

## Preserved (must not regress)
- Finder: free-text search, hub filter, sort (az/za/hub), saved-only, favorites in localStorage (`aivh:favs`), surprise-me spotlight, copy-link, shareable URL hash (#q=&hub=&sort=), "/" shortcut, empty states, result count.
- Hub cards: name, member count, blurb, member links, hub repo link.
