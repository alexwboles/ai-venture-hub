// AI Venture Hub — product catalogue (UMD: works in browser and Node)
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HUB = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var GH = "https://github.com/alexwboles/";

  var PRODUCTS = [
    // ---------- Business (10) ----------
    { slug: "quotely-ai", name: "Quotely", cat: "business", price: 24,
      tagline: "Describe the job, get a professional quote in seconds.",
      features: ["Plain-English job description → line items with 2026 pricing", "Branded quotes with Q-numbers, tax & deposit math, print/PDF", "Follow-up dates + win/loss tracking"] },
    { slug: "reviewpilot-ai", name: "ReviewPilot", cat: "business", price: 29,
      tagline: "More 5-star reviews, replies written in seconds.",
      features: ["Shareable review-ask page + printable QR code", "AI reply drafter in 3 tones, service-recovery mode for bad reviews", "14-day anti-nag: never ask the same customer twice"] },
    { slug: "socialspark-ai", name: "SocialSpark", cat: "business", price: 19,
      tagline: "One job photo → a full week of social posts.",
      features: ["7-day themed content calendar for 9 trades", "3 caption tones per post + hashtags + best time to post", "Copy-to-clipboard, mark-as-posted, saved content bank"] },
    { slug: "triagepilot-ai", name: "TriagePilot", cat: "business", price: 24,
      tagline: "Your inbox, sorted: urgent first, replies drafted.",
      features: ["Local AI classifier: Urgent / Needs reply / FYI / Spam", "One-click reply drafts in 2 tones, personalized", "Daily digest bar + 100% private, works offline"] },
    { slug: "invoicepilot-ai", name: "InvoicePilot", cat: "business", price: 19,
      tagline: "Invoices that get paid — and polite nudges when they don't.",
      features: ["Professional invoice builder with tax/discount + print/PDF", "AI late-payment reminders: gentle → firm → final", "Aging dashboard: outstanding, overdue, paid at a glance"] },
    { slug: "leadqualify-ai", name: "LeadQualify", cat: "business", price: 29,
      tagline: "A chat widget that scores your website leads while you sleep.",
      features: ["Embeddable with one script tag, configurable questions", "Hot / warm / cold scoring with plain-language reasons", "Lead inbox with filters + CSV export, after-hours responder"] },
    { slug: "sopforge-ai", name: "SOPForge", cat: "business", price: 15,
      tagline: "Plain-English description → step-by-step SOP checklist.",
      features: ["Steps with owner hints, time estimates and watch-outs", "Interactive checklist mode with progress + print", "5 starter templates + save/edit/duplicate library"] },
    { slug: "hirewise-ai", name: "HireWise", cat: "business", price: 29,
      tagline: "Better job posts, smarter shortlists.",
      features: ["Job-post builder in 3 tones + red-flags checklist", "Resume screener: fit score with evidence + interview questions", "Candidate pipeline board: applied → screening → interview → offer"] },
    { slug: "winback-ai", name: "WinBack", cat: "business", price: 29,
      tagline: "Turn your dead customer list into revenue again.",
      features: ["CSV import + RFM-lite segmentation (dormant VIPs found!)", "Per-segment email + SMS drafts with margin-smart offers", "ROI estimator + win-back tracking sheet"] },
    { slug: "menucraft-ai", name: "MenuCraft", cat: "business", price: 24,
      tagline: "Menus that make mouths water — with margins that make sense.",
      features: ["Dish descriptions in 3 styles: upscale, casual, fun", "Food-cost math + suggested price + margin health flags", "Printable menu layout + weekend specials generator"] },
    // ---------- Personal (5) ----------
    { slug: "nestlife-ai", name: "NestLife", cat: "personal", price: 8,
      tagline: "Meals, groceries, bills and chores — one calm place.",
      features: ["7-day meal planner from a 36-recipe bank + swap button", "Auto grocery list with merged ingredients + budget estimate", "Bill reminders in plain language + fair chore rotation"] },
    { slug: "budgetlens-ai", name: "BudgetLens", cat: "personal", price: 8,
      tagline: "Upload your bank CSV. See where your money actually goes.",
      features: ["Auto-categorization into 12+ spending categories", "Subscription detector finds recurring charges to cancel", "Plain-language savings nudges + month-over-month view"] },
    { slug: "homekeeper-ai", name: "HomeKeeper", cat: "personal", price: 6,
      tagline: "Your home's maintenance schedule, handled.",
      features: ["Personalized 12-month plan from a 60+ task rule bank", "This-week view with check-off + streaks", "Cost-of-neglect notes: what skipping it risks"] },
    { slug: "studyflow-ai", name: "StudyFlow", cat: "personal", price: 8,
      tagline: "Spaced-repetition exam prep that actually sticks.",
      features: ["Smart schedule across subjects with 1d/3d/7d/14d reviews", "Daily session queue with recall self-ratings", "Readiness % per subject + streak tracking"] },
    { slug: "giftgenius-ai", name: "GiftGenius", cat: "personal", price: 0,
      tagline: "Never panic-buy a gift again.",
      features: ["People profiles with interests + occasion countdowns", "Interest-matched gift ideas with why-it-fits notes", "Budget tracker + bought-list so no repeats next year"] }
  ];

  var STACKS = [
    { name: "Trades Growth Stack", slug: "trades-growth",
      pitch: "For plumbers, electricians, landscapers: quote faster, get paid faster, get reviewed, stay visible — the full job-to-referral loop.",
      products: ["quotely-ai", "invoicepilot-ai", "reviewpilot-ai", "socialspark-ai"] },
    { name: "Inbox Command", slug: "inbox-command",
      pitch: "Never miss a lead or an urgent email again: triage what arrives, qualify what visits.",
      products: ["triagepilot-ai", "leadqualify-ai"] },
    { name: "Family OS", slug: "family-os",
      pitch: "Run the household like it runs itself: dinners planned, money watched, home maintained, gifts handled.",
      products: ["nestlife-ai", "budgetlens-ai", "homekeeper-ai", "giftgenius-ai"] },
    { name: "Solo Founder Kit", slug: "solo-founder",
      pitch: "Everything a one-person business needs: document processes, hire help, win back customers, price the menu right.",
      products: ["sopforge-ai", "hirewise-ai", "winback-ai", "menucraft-ai"] }
  ];

  function priceLabel(p) { return p.price === 0 ? "Free" : "$" + p.price + "/mo"; }
  function repoUrl(p) { return GH + p.slug; }
  function totalMonthly() { return PRODUCTS.reduce(function (s, p) { return s + p.price; }, 0); }
  function byCat(cat) { return PRODUCTS.filter(function (p) { return p.cat === cat; }); }
  function search(q) {
    q = (q || "").toLowerCase().trim();
    if (!q) return PRODUCTS.slice();
    return PRODUCTS.filter(function (p) {
      return (p.name + " " + p.slug + " " + p.tagline + " " + p.features.join(" ")).toLowerCase().indexOf(q) !== -1;
    });
  }

  return { PRODUCTS: PRODUCTS, STACKS: STACKS, GH: GH, priceLabel: priceLabel, repoUrl: repoUrl,
           totalMonthly: totalMonthly, byCat: byCat, search: search };
});
