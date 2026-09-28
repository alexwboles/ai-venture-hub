// ai-venture-hub — minimal portfolio index (UMD: works in browser and Node)
//
// A plain index: 4 logical hub dashboards + an alphabetical list of the 15
// independent products. No suite narrative, no bundle math.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HUB = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var GH = "https://github.com/alexwboles/";

  var HUBS = [
    { slug: "trades-hub", name: "Trades Growth Stack",
      blurb: "Quoting, invoicing, reviews and social posts for field-service businesses.",
      members: ["quotely-ai", "invoicepilot-ai", "reviewpilot-ai", "socialspark-ai"] },
    { slug: "growth-hub", name: "Customer Growth Kit",
      blurb: "Win customers and win them back: leads, lapsed buyers, and restaurant menus.",
      members: ["leadqualify-ai", "winback-ai", "menucraft-ai"] },
    { slug: "ops-hub", name: "Back-Office OS",
      blurb: "The inside of the business: SOPs, hiring, and the inbox.",
      members: ["sopforge-ai", "hirewise-ai", "triagepilot-ai"] },
    { slug: "life-hub", name: "Personal Life OS",
      blurb: "Household, money, and personal goals — practical tools for real life.",
      members: ["nestlife-ai", "budgetlens-ai", "homekeeper-ai", "studyflow-ai", "giftgenius-ai"] }
  ];

  var PRODUCTS = [
    { slug: "budgetlens-ai", name: "BudgetLens",
      tagline: "Upload your bank CSV. See where your money actually goes." },
    { slug: "giftgenius-ai", name: "GiftGenius",
      tagline: "Never panic-buy a gift again." },
    { slug: "hirewise-ai", name: "HireWise",
      tagline: "Better job posts, smarter shortlists." },
    { slug: "homekeeper-ai", name: "HomeKeeper",
      tagline: "Your home's maintenance schedule, handled." },
    { slug: "invoicepilot-ai", name: "InvoicePilot",
      tagline: "Invoices that get paid — and polite nudges when they don't." },
    { slug: "leadqualify-ai", name: "LeadQualify",
      tagline: "A chat widget that scores your website leads while you sleep." },
    { slug: "menucraft-ai", name: "MenuCraft",
      tagline: "Menus that make mouths water — with margins that make sense." },
    { slug: "nestlife-ai", name: "NestLife",
      tagline: "Meals, groceries, bills and chores — one calm place." },
    { slug: "quotely-ai", name: "Quotely",
      tagline: "Describe the job, get a professional quote in seconds." },
    { slug: "reviewpilot-ai", name: "ReviewPilot",
      tagline: "More 5-star reviews, replies written in seconds." },
    { slug: "socialspark-ai", name: "SocialSpark",
      tagline: "One job photo → a full week of social posts." },
    { slug: "sopforge-ai", name: "SOPForge",
      tagline: "Plain-English description → step-by-step SOP checklist." },
    { slug: "studyflow-ai", name: "StudyFlow",
      tagline: "Spaced-repetition exam prep that actually sticks." },
    { slug: "triagepilot-ai", name: "TriagePilot",
      tagline: "Your inbox, sorted: urgent first, replies drafted." },
    { slug: "winback-ai", name: "WinBack",
      tagline: "Turn your dead customer list into revenue again." }
  ];

  function productBySlug(slug) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    return null;
  }
  function repoUrl(p) { return GH + p.slug; }
  function hubUrl(h) { return GH + h.slug; }

  return { HUBS: HUBS, PRODUCTS: PRODUCTS, GH: GH,
           productBySlug: productBySlug, repoUrl: repoUrl, hubUrl: hubUrl };
});
