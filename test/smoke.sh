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

const slugs = ["quotely-ai","reviewpilot-ai","socialspark-ai","triagepilot-ai","invoicepilot-ai",
  "leadqualify-ai","sopforge-ai","hirewise-ai","winback-ai","menucraft-ai",
  "nestlife-ai","budgetlens-ai","homekeeper-ai","studyflow-ai","giftgenius-ai"];
t("15 products total", HUB.PRODUCTS.length === 15);
t("all 15 slugs present", slugs.every(s => HUB.PRODUCTS.some(p => p.slug === s)));
t("repo links well-formed", HUB.PRODUCTS.every(p => HUB.repoUrl(p) === "https://github.com/alexwboles/" + p.slug));
t("every product has name + one-line tagline",
  HUB.PRODUCTS.every(p => p.name && p.tagline && p.tagline.length > 5));
t("no bundle-math fields on products",
  HUB.PRODUCTS.every(p => !("price" in p) && !("features" in p) && !("cluster" in p)));

const counts = { "trades-hub": 4, "growth-hub": 3, "ops-hub": 3, "life-hub": 5 };
t("hub member counts 4/3/3/5",
  HUB.HUBS.every(h => h.members.length === counts[h.slug]));
t("every hub member resolves to a real product",
  HUB.HUBS.every(h => h.members.every(sl => HUB.productBySlug(sl))));
const seen = {};
let dup = false;
HUB.HUBS.forEach(h => h.members.forEach(sl => { if (seen[sl]) dup = true; seen[sl] = 1; }));
t("every product in exactly one hub", !dup && Object.keys(seen).length === 15);

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
t("README lists all 15 products", slugs.every(s => readme.includes("github.com/alexwboles/" + s)));
t("README has no bundle math", !readme.includes("$271") && !/combined/i.test(readme));
'
[ $? -eq 0 ] && ok "node data assertions" || bad "node data assertions"

echo "---"
echo "smoke: $PASS passed, $FAIL failed"
exit $FAIL
