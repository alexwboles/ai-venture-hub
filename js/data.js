// AI Venture Hub — product portfolio catalogue (UMD: works in browser and Node)
//
// Framing: a PORTFOLIO of independent AI micro-products, grouped into clusters
// that make browsing sense. Each product stands alone; a few combine naturally
// into stacks. No artificial "one suite" narrative, no summed mega-bundle price.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HUB = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var GH = "https://github.com/alexwboles/";

  var CLUSTERS = [
    { id: "trades", name: "Trades & Field Services", short: "Trades",
      blurb: "The daily toolkit for plumbers, electricians, landscapers and other field pros: quote it, bill it, get reviewed, stay visible." },
    { id: "growth", name: "Marketing & Growth", short: "Growth",
      blurb: "Turn attention into customers, and one-time buyers into repeat revenue." },
    { id: "ops", name: "Team & Operations", short: "Ops",
      blurb: "Run the inside of the business: document processes, hire well, keep the inbox under control." },
    { id: "life", name: "Personal Life", short: "Personal",
      blurb: "Household, money and personal goals — practical AI help for real life." }
  ];

  var PRODUCTS = [
    // ---------- Trades & Field Services ----------
    { slug: "quotely-ai", name: "Quotely", cluster: "trades", price: 24,
      tagline: "Describe the job, get a professional quote in seconds.",
      features: ["Plain-English job description → line items with 2026 pricing", "Branded quotes with Q-numbers, tax & deposit math, print/PDF", "Follow-up dates + win/loss tracking"] },
    { slug: "invoicepilot-ai", name: "InvoicePilot", cluster: "trades", price: 19,
      tagline: "Invoices that get paid — and polite nudges when they don't.",
      features: ["Professional invoice builder with tax/discount + print/PDF", "AI late-payment reminders: gentle → firm → final", "Aging dashboard: outstanding, overdue, paid at a glance"] },
    { slug: "reviewpilot-ai", name: "ReviewPilot", cluster: "trades", price: 29,
      tagline: "More 5-star reviews, replies written in seconds.",
      features: ["Shareable review-ask page + printable QR code", "AI reply drafter in 3 tones, service-recovery mode for bad reviews", "14-day anti-nag: never ask the same customer twice"] },
    { slug: "socialspark-ai", name: "SocialSpark", cluster: "trades", price: 19,
      tagline: "One job photo → a full week of social posts.",
      features: ["7-day themed content calendar for 9 trades", "3 caption tones per post + hashtags + best time to post", "Copy-to-clipboard, mark-as-posted, saved content bank"] },
    // ---------- Marketing & Growth ----------
    { slug: "leadqualify-ai", name: "LeadQualify", cluster: "growth", price: 29,
      tagline: "A chat widget that scores your website leads while you sleep.",
      features: ["Embeddable with one script tag, configurable questions", "Hot / warm / cold scoring with plain-language reasons", "Lead inbox with filters + CSV export, after-hours responder"] },
    { slug: "winback-ai", name: "WinBack", cluster: "growth", price: 29,
      tagline: "Turn your dead customer list into revenue again.",
      features: ["CSV import + RFM-lite segmentation (dormant VIPs found!)", "Per-segment email + SMS drafts with margin-smart offers", "ROI estimator + win-back tracking sheet"] },
    { slug: "menucraft-ai", name: "MenuCraft", cluster: "growth", price: 24,
      tagline: "Menus that make mouths water — with margins that make sense.",
      features: ["Dish descriptions in 3 styles: upscale, casual, fun", "Food-cost math + suggested price + margin health flags", "Printable menu layout + weekend specials generator"] },
    // ---------- Team & Operations ----------
    { slug: "sopforge-ai", name: "SOPForge", cluster: "ops", price: 15,
      tagline: "Plain-English description → step-by-step SOP checklist.",
      features: ["Steps with owner hints, time estimates and watch-outs", "Interactive checklist mode with progress + print", "5 starter templates + save/edit/duplicate library"] },
    { slug: "hirewise-ai", name: "HireWise", cluster: "ops", price: 29,
      tagline: "Better job posts, smarter shortlists.",
      features: ["Job-post builder in 3 tones + red-flags checklist", "Resume screener: fit score with evidence + interview questions", "Candidate pipeline board: applied → screening → interview → offer"] },
    { slug: "triagepilot-ai", name: "TriagePilot", cluster: "ops", price: 24,
      tagline: "Your inbox, sorted: urgent first, replies drafted.",
      features: ["Local AI classifier: Urgent / Needs reply / FYI / Spam", "One-click reply drafts in 2 tones, personalized", "Daily digest bar + 100% private, works offline"] },
    // ---------- Personal Life ----------
    { slug: "nestlife-ai", name: "NestLife", cluster: "life", price: 8,
      tagline: "Meals, groceries, bills and chores — one calm place.",
      features: ["7-day meal planner from a 36-recipe bank + swap button", "Auto grocery list with merged ingredients + budget estimate", "Bill reminders in plain language + fair chore rotation"] },
    { slug: "budgetlens-ai", name: "BudgetLens", cluster: "life", price: 8,
      tagline: "Upload your bank CSV. See where your money actually goes.",
      features: ["Auto-categorization into 12+ spending categories", "Subscription detector finds recurring charges to cancel", "Plain-language savings nudges + month-over-month view"] },
    { slug: "homekeeper-ai", name: "HomeKeeper", cluster: "life", price: 6,
      tagline: "Your home's maintenance schedule, handled.",
      features: ["Personalized 12-month plan from a 60+ task rule bank", "This-week view with check-off + streaks", "Cost-of-neglect notes: what skipping it risks"] },
    { slug: "studyflow-ai", name: "StudyFlow", cluster: "life", price: 8,
      tagline: "Spaced-repetition exam prep that actually sticks.",
      features: ["Smart schedule across subjects with 1d/3d/7d/14d reviews", "Daily session queue with recall self-ratings", "Readiness % per subject + streak tracking"] },
    { slug: "giftgenius-ai", name: "GiftGenius", cluster: "life", price: 0,
      tagline: "Never panic-buy a gift again.",
      features: ["People profiles with interests + occasion countdowns", "Interest-matched gift ideas with why-it-fits notes", "Budget tracker + bought-list so no repeats next year"] }
  ];

  // Stacks: ONLY combinations that form a genuine shared workflow.
  // The "Solo Founder Kit" was dropped — SOPs + hiring + win-back + restaurant
  // menus never formed one workflow, and a forced bundle is worse than none.
  var STACKS = [
    { name: "Trades Growth Stack", slug: "trades-growth",
      pitch: "For plumbers, electricians, landscapers: quote faster, get paid faster, get reviewed, stay visible — the full job-to-referral loop.",
      why: "One customer, one workflow: the quote becomes the invoice, the finished job becomes the review and the social post.",
      products: ["quotely-ai", "invoicepilot-ai", "reviewpilot-ai", "socialspark-ai"] },
    { name: "Inbox Command", slug: "inbox-command",
      pitch: "Triage what arrives, qualify what visits: never miss a lead or an urgent email again.",
      why: "Every inbound message — email or website chat — gets triaged and answered; nothing slips through the cracks.",
      products: ["triagepilot-ai", "leadqualify-ai"] },
    { name: "Family OS", slug: "family-os",
      pitch: "Run the household like it runs itself: dinners planned, money watched, home maintained, gifts handled.",
      why: "One household, one calm system: the same family's dinners, spending, maintenance and occasions, planned in one place.",
      products: ["nestlife-ai", "budgetlens-ai", "homekeeper-ai", "giftgenius-ai"] },
    { name: "Run the Team", slug: "run-the-team",
      pitch: "SOPs first, hiring second: write down the playbook, then bring people onto it.",
      why: "Document how the work gets done, then hire people into a system that already exists — not the other way round.",
      products: ["sopforge-ai", "hirewise-ai"] }
  ];

  function clusterById(id) {
    for (var i = 0; i < CLUSTERS.length; i++) if (CLUSTERS[i].id === id) return CLUSTERS[i];
    return null;
  }
  function priceLabel(p) { return p.price === 0 ? "Free" : "$" + p.price + "/mo"; }
  function repoUrl(p) { return GH + p.slug; }
  function byCluster(id) { return PRODUCTS.filter(function (p) { return p.cluster === id; }); }
  function clusterValue(id) {
    return byCluster(id).reduce(function (s, p) { return s + p.price; }, 0);
  }
  function search(q) {
    q = (q || "").toLowerCase().trim();
    if (!q) return PRODUCTS.slice();
    return PRODUCTS.filter(function (p) {
      var c = clusterById(p.cluster);
      var hay = p.name + " " + p.slug + " " + p.tagline + " " + p.features.join(" ") +
                (c ? " " + c.name : "");
      return hay.toLowerCase().indexOf(q) !== -1;
    });
  }

  return { PRODUCTS: PRODUCTS, CLUSTERS: CLUSTERS, STACKS: STACKS, GH: GH,
           priceLabel: priceLabel, repoUrl: repoUrl, clusterById: clusterById,
           byCluster: byCluster, clusterValue: clusterValue, search: search };
});
