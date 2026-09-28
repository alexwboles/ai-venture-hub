#!/usr/bin/env bash
# e2e.sh — end-to-end flows for ai-venture-hub portfolio (exercises catalogue logic in node)
set -u
cd "$(dirname "$0")/.."
node -e '
const HUB = require("./js/data.js");
let pass = 0, fail = 0;
const flow = (name, fn) => {
  try { fn(); pass++; console.log("PASS flow: " + name); }
  catch (e) { fail++; console.log("FAIL flow: " + name + " — " + e.message); }
};
const assert = require("assert");

// Flow 1: search finds the quote builder
flow("search quote -> quotely-ai", () => {
  const r = HUB.search("quote");
  assert(r.some(p => p.slug === "quotely-ai"), "quotely-ai missing");
});

// Flow 2: search finds the gift finder (personal life cluster)
flow("search gift -> giftgenius-ai in life cluster", () => {
  const r = HUB.search("gift");
  const g = r.find(p => p.slug === "giftgenius-ai");
  assert(g, "giftgenius-ai missing");
  assert.strictEqual(g.cluster, "life");
});

// Flow 3: cluster membership counts — trades 4, growth 3, ops 3, life 5
flow("cluster counts", () => {
  assert.strictEqual(HUB.byCluster("trades").length, 4, "trades");
  assert.strictEqual(HUB.byCluster("growth").length, 3, "growth");
  assert.strictEqual(HUB.byCluster("ops").length, 3, "ops");
  assert.strictEqual(HUB.byCluster("life").length, 5, "life");
  assert.strictEqual(HUB.CLUSTERS.length, 4, "cluster defs");
});

// Flow 4: per-cluster values — 91 / 82 / 68 / 30, and NO suite-wide sum
flow("per-cluster values, no suite sum", () => {
  assert.strictEqual(HUB.clusterValue("trades"), 91, "trades value");
  assert.strictEqual(HUB.clusterValue("growth"), 82, "growth value");
  assert.strictEqual(HUB.clusterValue("ops"), 68, "ops value");
  assert.strictEqual(HUB.clusterValue("life"), 30, "life value");
  assert.strictEqual(typeof HUB.totalMonthly, "undefined", "suite-wide total must not exist");
});

// Flow 5: every stack slug resolves; stacks only group same-workflow products
flow("stacks resolve + are coherent", () => {
  const trades = new Set(HUB.byCluster("trades").map(p => p.slug));
  HUB.STACKS.forEach(s => {
    assert(s.why && s.why.length > 20, "stack " + s.name + " missing why");
    s.products.forEach(sl => {
      const p = HUB.PRODUCTS.find(x => x.slug === sl);
      assert(p, "stack " + s.name + " references unknown slug " + sl);
      assert(HUB.repoUrl(p).startsWith("https://github.com/alexwboles/"), "bad repo url");
    });
  });
  // the trades stack draws only from the trades cluster
  const ts = HUB.STACKS.find(s => s.slug === "trades-growth");
  assert(ts.products.every(sl => trades.has(sl)), "trades stack mixes clusters");
});

// Flow 6: search covers cluster names too (e.g. "SOP" finds sopforge-ai)
flow("search covers cluster vocabulary", () => {
  assert(HUB.search("SOP").some(p => p.slug === "sopforge-ai"), "SOP search");
  assert.strictEqual(HUB.search("").length, 15, "empty search");
  assert.strictEqual(HUB.search("zzz-no-such-thing").length, 0, "nonsense search");
});

// Flow 7: rendered HTML has no suite-wide $271 counter and no old cat badges
flow("no suite counter / old badges", () => {
  const html = require("fs").readFileSync("index.html", "utf8");
  assert(!html.includes("$271"), "$271 suite counter still present");
  assert(!html.includes("total-value"), "total-value element still present");
  assert(!html.includes("badge-business") && !html.includes("badge-personal"), "old cat badges");
  // badges are rendered at runtime by app.js — verify it builds cluster badges
  const app = require("fs").readFileSync("js/app.js", "utf8");
  assert(app.includes("badge-") && app.includes("p.cluster"), "app.js must render per-cluster badges");
});

// Flow 8: case-insensitive search
flow("case-insensitive search", () => {
  const upper = HUB.search("INBOX").map(p => p.slug).sort().join(",");
  const lower = HUB.search("inbox").map(p => p.slug).sort().join(",");
  assert.strictEqual(upper, lower, "upper vs lower differ");
  assert(upper.split(",").includes("triagepilot-ai"), "inbox search misses triagepilot");
});

console.log("---");
console.log("e2e: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
'
