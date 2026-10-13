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
t("filterProducts: empty query returns all 54",
  HUB.filterProducts("", "").length === 54);
t("filterProducts: query narrows (wedding -> 1)",
  HUB.filterProducts("wedding", "").length === 1 &&
  HUB.filterProducts("wedding", "")[0].slug === "weddingplan-ai");
t("filterProducts: hub filter isolates trades hub",
  HUB.filterProducts("", "trades-hub").length === 6 &&
  HUB.filterProducts("", "trades-hub").every(p => HUB.hubOfProduct(p.slug).slug === "trades-hub"));
t("filterProducts: query + hub combine",
  HUB.filterProducts("quote", "trades-hub").length === 1);
t("filterProducts: no match -> empty",
  HUB.filterProducts("zzz-no-such-thing", "").length === 0);
t("hubOfProduct resolves (winback -> growth-hub)",
  HUB.hubOfProduct("winback-ai") && HUB.hubOfProduct("winback-ai").slug === "growth-hub");
t("hubOfProduct null for unknown slug", HUB.hubOfProduct("nope-ai") === null);
t("randomProduct returns a real product",
  !!HUB.productBySlug(HUB.randomProduct().slug));

// second sweep: sort modes
t("sortProducts az is A-Z",
  HUB.sortProducts(HUB.PRODUCTS, "az").map(p => p.name)
    .every((n, i, a) => i === 0 || a[i-1].localeCompare(n) <= 0));
t("sortProducts za reverses az",
  HUB.sortProducts(HUB.PRODUCTS, "za")[0].slug ===
  HUB.sortProducts(HUB.PRODUCTS, "az").slice(-1)[0].slug);
t("sortProducts hub groups by hub order (trades first, life last)",
  (() => {
    const s = HUB.sortProducts(HUB.PRODUCTS, "hub");
    const order = HUB.HUBS.map(h => h.slug);
    const seq = s.map(p => order.indexOf(HUB.hubOfProduct(p.slug).slug));
    const nonDecreasing = seq.every((o, i) => i === 0 || o >= seq[i-1]);
    const azWithin = HUB.HUBS.every(h => {
      const names = s.filter(p => HUB.hubOfProduct(p.slug).slug === h.slug).map(p => p.name);
      return names.every((n, i) => i === 0 || names[i-1].localeCompare(n) <= 0);
    });
    return seq[0] === 0 && seq[seq.length-1] === order.length-1 && nonDecreasing && azWithin;
  })());
t("sortProducts does not mutate input",
  (() => { const c = HUB.PRODUCTS.slice(); HUB.sortProducts(HUB.PRODUCTS, "za"); return HUB.PRODUCTS.every((p, i) => p === c[i]); })());

// second sweep: shareable hash state
t("stateToHash/hashToState round-trip",
  (() => {
    const st = { q: "wedding plan", hub: "life-hub", sort: "za" };
    const back = HUB.hashToState(HUB.stateToHash(st));
    return back.q === st.q && back.hub === st.hub && back.sort === st.sort;
  })());
t("stateToHash encodes special chars + omits defaults",
  HUB.stateToHash({ q: "a b&c", hub: "", sort: "az" }) === "#q=a%20b%26c" &&
  HUB.stateToHash({ q: "", hub: "", sort: "az" }) === "");
t("hashToState ignores unknown hub/sort values",
  (() => { const s = HUB.hashToState("#hub=nope&sort=bogus&q=x"); return s.hub === "" && s.sort === "az" && s.q === "x"; })());
t("hashToState tolerates empty hash", HUB.hashToState("").q === "" && HUB.hashToState("").sort === "az");
const app2 = fs.readFileSync("js/app.js", "utf8");
t("app wires finder (search + hub filter + surprise + copy link)",
  app2.includes("prodSearch") && app2.includes("hubFilter") && app2.includes("surpriseBtn") &&
  app2.includes("filterProducts") && app2.includes("randomProduct") && app2.includes("copy-link"));
const html2 = fs.readFileSync("index.html", "utf8");
t("index has finder markup",
  /id="prodSearch"/.test(html2) && /id="hubFilter"/.test(html2) &&
  /id="surpriseBtn"/.test(html2) && /id="prodCount"/.test(html2));
t("index has sort + saved-only controls",
  /id="sortSel"/.test(html2) && /id="favOnlyBtn"/.test(html2));
const app3 = fs.readFileSync("js/app.js", "utf8");
t("app wires sort, hash sync and favorites",
  app3.includes("sortSel") && app3.includes("favOnlyBtn") &&
  app3.includes("sortProducts") && app3.includes("stateToHash") &&
  app3.includes("hashToState") && app3.includes("toggleFav") &&
  app3.includes("data-fav") && app3.includes("syncHash"));

'
[ $? -eq 0 ] && ok "node data assertions" || bad "node data assertions"

echo "---"
echo "smoke: $PASS passed, $FAIL failed"
exit $FAIL
