#!/usr/bin/env bash
# smoke.sh — fast sanity checks for ai-venture-hub
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
const assert = require("assert");
let n = 0;
const t = (name, cond) => { n++; console.log((cond ? "PASS" : "FAIL") + ": " + name); if (!cond) process.exitCode = 1; };

t("15 products total", HUB.PRODUCTS.length === 15);
const slugs = ["quotely-ai","reviewpilot-ai","socialspark-ai","triagepilot-ai","invoicepilot-ai",
  "leadqualify-ai","sopforge-ai","hirewise-ai","winback-ai","menucraft-ai",
  "nestlife-ai","budgetlens-ai","homekeeper-ai","studyflow-ai","giftgenius-ai"];
t("all 15 slugs present", slugs.every(s => HUB.PRODUCTS.some(p => p.slug === s)));
t("repo links well-formed", HUB.PRODUCTS.every(p => HUB.repoUrl(p) === "https://github.com/alexwboles/" + p.slug));
t("prices are non-negative numbers", HUB.PRODUCTS.every(p => typeof p.price === "number" && p.price >= 0));
t("every product has name/tagline/3 features/valid cat",
  HUB.PRODUCTS.every(p => p.name && p.tagline && p.features.length >= 3 && (p.cat === "business" || p.cat === "personal")));
t("4 stacks defined", HUB.STACKS.length === 4);
t("every stack product references a real slug",
  HUB.STACKS.every(s => s.products.every(sl => HUB.PRODUCTS.some(p => p.slug === sl))));
t("totalMonthly = 271", HUB.totalMonthly() === 271);
t("priceLabel free vs paid", HUB.priceLabel({price:0}) === "Free" && HUB.priceLabel({price:24}) === "$24/mo");
t("hero mentions 15 products", require("fs").readFileSync("index.html","utf8").includes("15 AI micro-products"));
t("README mentions stacks", require("fs").readFileSync("README.md","utf8").includes("Stacks"));
console.log("data assertions run: " + n);
'
[ $? -eq 0 ] && ok "node data assertions" || bad "node data assertions"

echo "---"
echo "smoke: $PASS passed, $FAIL failed"
exit $FAIL
