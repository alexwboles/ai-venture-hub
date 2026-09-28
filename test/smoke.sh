#!/usr/bin/env bash
# smoke.sh — fast sanity checks for ai-venture-hub (portfolio framing)
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
let n = 0;
const t = (name, cond) => { n++; console.log((cond ? "PASS" : "FAIL") + ": " + name); if (!cond) process.exitCode = 1; };

t("15 products total", HUB.PRODUCTS.length === 15);
const slugs = ["quotely-ai","reviewpilot-ai","socialspark-ai","triagepilot-ai","invoicepilot-ai",
  "leadqualify-ai","sopforge-ai","hirewise-ai","winback-ai","menucraft-ai",
  "nestlife-ai","budgetlens-ai","homekeeper-ai","studyflow-ai","giftgenius-ai"];
t("all 15 slugs present", slugs.every(s => HUB.PRODUCTS.some(p => p.slug === s)));
t("repo links well-formed", HUB.PRODUCTS.every(p => HUB.repoUrl(p) === "https://github.com/alexwboles/" + p.slug));
t("prices are non-negative numbers", HUB.PRODUCTS.every(p => typeof p.price === "number" && p.price >= 0));
t("every product has name/tagline/3 features",
  HUB.PRODUCTS.every(p => p.name && p.tagline && p.features.length >= 3));

const ids = HUB.CLUSTERS.map(c => c.id);
t("4 clusters defined", HUB.CLUSTERS.length === 4);
t("every product in exactly one valid cluster",
  HUB.PRODUCTS.every(p => typeof p.cluster === "string" && ids.filter(id => id === p.cluster).length === 1));
t("every cluster has a name, short label and blurb",
  HUB.CLUSTERS.every(c => c.name && c.short && c.blurb));
t("no product still uses the old cat field", HUB.PRODUCTS.every(p => !("cat" in p)));
t("no suite-wide totalMonthly helper (no fake bundle price)", typeof HUB.totalMonthly === "undefined");

t("4 stacks defined", HUB.STACKS.length === 4);
t("every stack product references a real slug",
  HUB.STACKS.every(s => s.products.every(sl => HUB.PRODUCTS.some(p => p.slug === sl))));
t("every stack has a one-line why-it-goes-together",
  HUB.STACKS.every(s => typeof s.why === "string" && s.why.length > 20));
t("forced Solo Founder Kit stack is gone",
  !HUB.STACKS.some(s => s.slug === "solo-founder"));

t("priceLabel free vs paid", HUB.priceLabel({price:0}) === "Free" && HUB.priceLabel({price:24}) === "$24/mo");

const html = fs.readFileSync("index.html","utf8");
t("hero frames it as a portfolio", /independent/i.test(html) && /portfolio/i.test(html));
t("no $271 suite-wide value counter anywhere", !html.includes("$271"));
t("philosophy section present", /philosophy/i.test(html));

const readme = fs.readFileSync("README.md","utf8");
t("README explains portfolio framing", /portfolio/i.test(readme) && /independent/i.test(readme));
t("README documents dropped forced bundle", /Solo Founder Kit/i.test(readme));

console.log("data assertions run: " + n);
'
[ $? -eq 0 ] && ok "node data assertions" || bad "node data assertions"

echo "---"
echo "smoke: $PASS passed, $FAIL failed"
exit $FAIL
