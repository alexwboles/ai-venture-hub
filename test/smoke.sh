#!/usr/bin/env bash
# smoke.sh — fast sanity checks for ai-venture-hub (minimal portfolio index)
set -u
cd "$(dirname "$0")/.."
PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "PASS: $1"; }
bad()  { FAIL=$((FAIL+1)); echo "FAIL: $1"; }

# 1. required files exist
for f in index.html css/style.css js/data.js js/app.js README.md; do
  [ -f "$f" ] && ok "file exists: $f" || bad "missing file: $f"
done

# 2-3. JS syntax
node --check js/data.js 2>/dev/null && ok "data.js syntax" || bad "data.js syntax"
node --check js/app.js 2>/dev/null && ok "app.js syntax" || bad "app.js syntax"

# 4+. data-driven checks via node
node -e '
const HUB = require("./js/data.js");
const fs = require("fs");
const t = (name, cond) => { console.log((cond ? "PASS" : "FAIL") + ": " + name); if (!cond) process.exitCode = 1; };

const hubSlugs = ["trades-hub", "growth-hub", "ops-hub", "life-hub"];
t("4 hubs defined", HUB.HUBS.length === 4);
t("hub slugs are the 4 logical hubs", hubSlugs.every(s => HUB.HUBS.some(h => h.slug === s)));
t("hub links well-formed", HUB.HUBS.every(h => HUB.hubUrl(h) === "https://github.com/alexwboles/" + h.slug));
t("every hub has name + blurb", HUB.HUBS.every(h => h.name && h.blurb && h.blurb.length > 10));

const slugs = [
  "adcopy-ai","apartmenthunt-ai","applypilot-ai","babytracker-ai","bizbrain-ai",
  "bookpilot-ai","bucketlist-ai","budgetlens-ai","cashflow-ai","debtpayoff-ai",
  "fitnessplan-ai","fleetlog-ai","gardenplan-ai","giftgenius-ai","habitloop-ai",
  "hearth-ai","hirewise-ai","homeinventory-ai","homekeeper-ai","invoicepilot-ai",
  "journalpilot-ai","leadqualify-ai","loyaltyloop-ai","materiallist-ai","medtrack-ai",
  "menucraft-ai","movingcheck-ai","nestlife-ai","onboardpilot-ai","partyplan-ai",
  "permitpilot-ai","pricingpilot-ai","quotely-ai","recipebox-ai","referralpilot-ai",
  "reviewpilot-ai","roadtrip-ai","roommatesplit-ai","safetycheck-ai","seocheck-ai",
  "shiftplan-ai","sidehustle-ai","signpilot-ai","sitevisit-ai","socialspark-ai",
  "sopforge-ai","speechwriter-ai","studyflow-ai","taxprep-ai","travelpack-ai",
  "triagepilot-ai","wardrobe-ai","weddingplan-ai","winback-ai"
];
t("54 products total", HUB.PRODUCTS.length === 54);
t("all 54 slugs present", slugs.every(s => HUB.PRODUCTS.some(p => p.slug === s)));
t("repo links well-formed", HUB.PRODUCTS.every(p => HUB.repoUrl(p) === "https://github.com/alexwboles/" + p.slug));
t("every product has name + one-line tagline",
  HUB.PRODUCTS.every(p => p.name && p.tagline && p.tagline.length > 5));
t("no bundle-math fields on products",
  HUB.PRODUCTS.every(p => !("price" in p) && !("features" in p) && !("cluster" in p)));

const counts = { "trades-hub": 6, "growth-hub": 9, "ops-hub": 10, "life-hub": 29 };
t("hub member counts 6/9/10/29",
  HUB.HUBS.every(h => h.members.length === counts[h.slug]));
t("every hub member resolves to a real product",
  HUB.HUBS.every(h => h.members.every(sl => HUB.productBySlug(sl))));
const seen = {};
let dup = false;
HUB.HUBS.forEach(h => h.members.forEach(sl => { if (seen[sl]) dup = true; seen[sl] = 1; }));
t("every product in exactly one hub", !dup && Object.keys(seen).length === 54);

t("no leftover suite-era exports",
  typeof HUB.STACKS === "undefined" && typeof HUB.CLUSTERS === "undefined" &&
  typeof HUB.search === "undefined" && typeof HUB.totalMonthly === "undefined" &&
  typeof HUB.clusterValue === "undefined" && typeof HUB.priceLabel === "undefined");

const html = fs.readFileSync("index.html", "utf8");
t("page title names AI Micro-Products",
  html.indexOf("<title>") !== -1 && html.indexOf("AI Micro-Products") !== -1);
t("honest one-liner present", html.includes("Independent tools, each free to run. Grouped into logical hubs where they belong together."));
t("index.html wires data.js + app.js (hubs render at runtime)",
  html.indexOf("js/data.js") !== -1 && html.indexOf("js/app.js") !== -1 && /id="hubs"/.test(html));
t("no $271 counter", !html.includes("$271"));
t("no suite language", !/one suite|mega-suite|suite-wide|forced bundles/i.test(html));
t("no stacks section", !html.includes("stacks-sec") && !/id="stacks"/.test(html));
t("no cluster badges", !html.includes("cluster-") && !html.includes("badge-"));

const readme = fs.readFileSync("README.md", "utf8");
t("README lists all 4 hubs", hubSlugs.every(s => readme.includes("github.com/alexwboles/" + s)));
t("README lists all 54 products", slugs.every(s => readme.includes("github.com/alexwboles/" + s)));
t("README has no bundle math", !readme.includes("$271") && !/combined/i.test(readme));
'
[ $? -eq 0 ] && ok "node data assertions" || bad "node data assertions"

echo "---"
echo "smoke: $PASS passed, $FAIL failed"
exit $FAIL
