# AI Venture Hub

A **portfolio** of **15 independent AI micro-products** — built in a single overnight sprint, all free to run, all local-first.

## The concept (revised)

These products do *not* all belong together — and that's the point. Each one solves one problem for one kind of user and works fully on its own. This page is the portfolio front door: browse by **cluster** (products that serve similar users), and find the few **stacks** (bundles that genuinely share a workflow).

**Philosophy:** connect ideas only where it makes sense. A portfolio of independent products with a few natural bundles beats one artificial mega-product.

## The 4 clusters

- **Trades & Field Services** ($91/mo combined) — quotely-ai · invoicepilot-ai · reviewpilot-ai · socialspark-ai
- **Marketing & Growth** ($82/mo combined) — leadqualify-ai · winback-ai · menucraft-ai
- **Team & Operations** ($68/mo combined) — sopforge-ai · hirewise-ai · triagepilot-ai
- **Personal Life** ($30/mo combined) — nestlife-ai · budgetlens-ai · homekeeper-ai · studyflow-ai · giftgenius-ai

All live at `https://github.com/alexwboles/<slug>`.

## Stacks — only where they earn it

- **Trades Growth Stack** — quotely + invoicepilot + reviewpilot + socialspark. *Why:* one customer, one workflow — the quote becomes the invoice, the finished job becomes the review and the social post.
- **Inbox Command** — triagepilot + leadqualify. *Why:* every inbound message, email or website chat, gets triaged and answered; nothing slips through.
- **Family OS** — nestlife + budgetlens + homekeeper + giftgenius. *Why:* one household, one calm system — dinners, spending, maintenance and occasions planned in one place.
- **Run the Team** — sopforge + hirewise. *Why:* document how the work gets done, then hire people into a system that already exists.

(Dropped: the old "Solo Founder Kit" — SOPs + hiring + win-back + restaurant menus never formed one workflow. Forced bundles are worse than none.)

## Principles (every product)

1. **Independent by default** — solves one problem, works fully on its own.
2. **Free to run** — no paid services; AI works locally, an OpenAI key is optional polish.
3. **Local-first** — data stays in the browser / on the machine.
4. **Tested** — smoke + e2e tests, green before ship.
5. **Open** — public repos, linked from every card.

## Run it

Just open `index.html` in a browser. No build step, zero dependencies.

## Tests

```bash
bash test/smoke.sh
bash test/e2e.sh
```
