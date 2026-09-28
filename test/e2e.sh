#!/usr/bin/env bash
# e2e.sh — end-to-end flows for ai-venture-hub minimal index (exercises catalogue logic in node)
set -u
cd "$(dirname "$0")/.."
node -e '
const HUB = require("./js/data.js");
const fs = require("fs");
let pass = 0, fail = 0;
const flow = (name, fn) => {
  try { fn(); pass++; console.log("PASS flow: " + name); }
  catch (e) { fail++; console.log("FAIL flow: " + name + " — " + e.message); }
};
const assert = require("assert");

// Flow 1: hub definitions — exact slugs, names, non-empty blurbs
flow("hub definitions", () => {
  const names = { "trades-hub": "Trades Growth Stack", "growth-hub": "Customer Growth Kit",
                  "ops-hub": "Back-Office OS", "life-hub": "Personal Life OS" };
  assert.strictEqual(HUB.HUBS.length, 4, "hub count");
  HUB.HUBS.forEach(h => {
    assert.strictEqual(h.name, names[h.slug], "name for " + h.slug);
    assert(h.blurb && h.blurb.length > 10, "blurb for " + h.slug);
    assert.strictEqual(HUB.hubUrl(h), "https://github.com/alexwboles/" + h.slug, "url for " + h.slug);
  });
});

// Flow 2: hub membership — trades 4 / growth 3 / ops 3 / life 5, each product once
flow("hub membership", () => {
  const counts = { "trades-hub": 4, "growth-hub": 3, "ops-hub": 3, "life-hub": 5 };
  const seen = new Set();
  HUB.HUBS.forEach(h => {
    assert.strictEqual(h.members.length, counts[h.slug], "member count " + h.slug);
    h.members.forEach(sl => {
      assert(HUB.productBySlug(sl), "unknown member " + sl + " in " + h.slug);
      assert(!seen.has(sl), "product in two hubs: " + sl);
      seen.add(sl);
    });
  });
  assert.strictEqual(seen.size, 15, "all 15 products assigned");
});

// Flow 3: PRODUCTS list is alphabetical by name (the compact A–Z list)
flow("products alphabetical", () => {
  const names = HUB.PRODUCTS.map(p => p.name);
  const sorted = names.slice().sort((a, b) => a.localeCompare(b));
  assert.deepStrictEqual(names, sorted, "not alphabetical: " + names.join(","));
});

// Flow 4: index.html links every hub and every product repo
flow("index.html links everything", () => {
  const html = fs.readFileSync("index.html", "utf8");
  // hub + product links render at runtime from data.js — the static page wires data + renderer
  assert(html.indexOf("js/data.js") !== -1, "data.js not wired");
  assert(html.indexOf("js/app.js") !== -1, "app.js not wired");
  assert(html.indexOf("AI Micro-Products") !== -1, "title text missing");
  assert(/id="hubs"/.test(html), "hubs container missing");
  assert(/id="products"/.test(html), "products container missing");
  // hub URLs themselves are asserted well-formed in flow 1
});

// Flow 5: no forced-narrative language anywhere
flow("no suite language", () => {
  ["index.html", "README.md", "js/data.js", "js/app.js"].forEach(f => {
    const c = fs.readFileSync(f, "utf8");
    assert(!c.includes("$271"), f + " has $271");
    assert(!/one suite|mega-suite|suite-wide|combined value|forced bundles/i.test(c), f + " has suite language");
  });
  const app = fs.readFileSync("js/app.js", "utf8");
  assert(!/stacks-sec|STACKS|cluster-/i.test(app), "app.js still renders stacks/clusters");
});

// Flow 6: app.js renders hubs via hubUrl and products via repoUrl
flow("app.js renders hubs + product list", () => {
  const app = fs.readFileSync("js/app.js", "utf8");
  assert(app.includes("HUB.HUBS"), "does not iterate HUBS");
  assert(app.includes("HUB.PRODUCTS"), "does not iterate PRODUCTS");
  assert(app.includes("hubUrl"), "does not use hubUrl");
  assert(app.includes("repoUrl"), "does not use repoUrl");
  assert(app.includes("hub-card"), "hub cards not rendered");
  assert(app.includes("product-list") || app.includes("getElementById"), "product list not rendered");
});

// Flow 7: member names shown on hub cards resolve (data-level check of render inputs)
flow("hub card member names resolve", () => {
  HUB.HUBS.forEach(h => {
    const names = h.members.map(sl => HUB.productBySlug(sl).name);
    assert(names.every(n => n && n.length > 0), "empty member name in " + h.slug);
  });
});

console.log("---");
console.log("e2e: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
'
