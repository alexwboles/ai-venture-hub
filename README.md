# Alex's AI Micro-Products

Independent tools, each free to run. Grouped into logical hubs where they belong together.

## Hubs

| Hub | What it is | Products |
|-----|-----------|----------|
| [Trades Growth Stack](https://github.com/alexwboles/trades-hub) | Quoting, invoicing, reviews and social posts for field-service businesses. | quotely-ai · invoicepilot-ai · reviewpilot-ai · socialspark-ai |
| [Customer Growth Kit](https://github.com/alexwboles/growth-hub) | Win customers and win them back: leads, lapsed buyers, and restaurant menus. | leadqualify-ai · winback-ai · menucraft-ai |
| [Back-Office OS](https://github.com/alexwboles/ops-hub) | The inside of the business: SOPs, hiring, and the inbox. | sopforge-ai · hirewise-ai · triagepilot-ai |
| [Personal Life OS](https://github.com/alexwboles/life-hub) | Household, money, and personal goals — practical tools for real life. | nestlife-ai · budgetlens-ai · homekeeper-ai · studyflow-ai · giftgenius-ai |

## All products (A–Z)

- [BudgetLens](https://github.com/alexwboles/budgetlens-ai) — Upload your bank CSV. See where your money actually goes.
- [GiftGenius](https://github.com/alexwboles/giftgenius-ai) — Never panic-buy a gift again.
- [HireWise](https://github.com/alexwboles/hirewise-ai) — Better job posts, smarter shortlists.
- [HomeKeeper](https://github.com/alexwboles/homekeeper-ai) — Your home's maintenance schedule, handled.
- [InvoicePilot](https://github.com/alexwboles/invoicepilot-ai) — Invoices that get paid — and polite nudges when they don't.
- [LeadQualify](https://github.com/alexwboles/leadqualify-ai) — A chat widget that scores your website leads while you sleep.
- [MenuCraft](https://github.com/alexwboles/menucraft-ai) — Menus that make mouths water — with margins that make sense.
- [NestLife](https://github.com/alexwboles/nestlife-ai) — Meals, groceries, bills and chores — one calm place.
- [Quotely](https://github.com/alexwboles/quotely-ai) — Describe the job, get a professional quote in seconds.
- [ReviewPilot](https://github.com/alexwboles/reviewpilot-ai) — More 5-star reviews, replies written in seconds.
- [SocialSpark](https://github.com/alexwboles/socialspark-ai) — One job photo → a full week of social posts.
- [SOPForge](https://github.com/alexwboles/sopforge-ai) — Plain-English description → step-by-step SOP checklist.
- [StudyFlow](https://github.com/alexwboles/studyflow-ai) — Spaced-repetition exam prep that actually sticks.
- [TriagePilot](https://github.com/alexwboles/triagepilot-ai) — Your inbox, sorted: urgent first, replies drafted.
- [WinBack](https://github.com/alexwboles/winback-ai) — Turn your dead customer list into revenue again.

## Principles (every product)

1. **Independent** — each solves one problem for one kind of user, and works fully on its own.
2. **Free to run** — no paid services; AI works locally, an OpenAI key is optional polish.
3. **Local-first** — data stays in the browser / on the machine.
4. **Tested** — smoke + e2e tests, green before ship.
5. **Open** — public repos, linked above.

## Run it

Just open `index.html` in a browser. No build step, zero dependencies.

## Tests

```bash
bash test/smoke.sh
bash test/e2e.sh
```
