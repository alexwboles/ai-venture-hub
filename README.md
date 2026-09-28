# AI Venture Hub

One dashboard uniting **15 AI micro-products** — built in a single overnight sprint, all free to run, all local-first.

## The concept

Fifteen separate repos are hard to browse. This hub is the single front door:

- **Search + filter** — find any product, filter Business / Personal.
- **Stacks** — curated bundles where 2–4 products solve one bigger problem together:
  - **Trades Growth Stack** — quotely + invoicepilot + reviewpilot + socialspark (the full job-to-referral loop)
  - **Inbox Command** — triagepilot + leadqualify (never miss a lead or urgent email)
  - **Family OS** — nestlife + budgetlens + homekeeper + giftgenius (household on autopilot)
  - **Solo Founder Kit** — sopforge + hirewise + winback + menucraft (run a one-person business)
- **Total value counter** — $271/mo if bought separately.

## The 15 products

Business: quotely-ai · reviewpilot-ai · socialspark-ai · triagepilot-ai · invoicepilot-ai · leadqualify-ai · sopforge-ai · hirewise-ai · winback-ai · menucraft-ai
Personal: nestlife-ai · budgetlens-ai · homekeeper-ai · studyflow-ai · giftgenius-ai

All live at `https://github.com/alexwboles/<slug>`.

## Principles (every product)

1. **Free to run** — no paid services; AI works locally, an OpenAI key is optional polish.
2. **Local-first** — data stays in the browser / on the machine.
3. **Tested** — smoke + e2e tests, green before ship.
4. **Open** — public repos, linked from every card.

## Run it

Just open `index.html` in a browser. No build step, zero dependencies.

## Tests

```bash
bash test/smoke.sh
bash test/e2e.sh
```
