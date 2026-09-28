#!/usr/bin/env bash
# e2e.sh — end-to-end flows for ai-venture-hub (exercises catalogue logic in node)
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

// Flow 2: search finds the gift finder (personal)
flow("search gift -> giftgenius-ai", () => {
  const r = HUB.search("gift");
  assert(r.some(p => p.slug === "giftgenius-ai"), "giftgenius-ai missing");
});

// Flow 3: category counts 10 business / 5 personal
flow("category counts", () => {
  assert.strictEqual(HUB.byCat("business").length, 10, "business count");
  assert.strictEqual(HUB.byCat("personal").length, 5, "personal count");
});

// Flow 4: every stack slug resolves to a real product card
flow("stacks reference real slugs", () => {
  HUB.STACKS.forEach(s => s.products.forEach(sl => {
    const p = HUB.PRODUCTS.find(x => x.slug === sl);
    assert(p, "stack " + s.name + " references unknown slug " + sl);
    assert(HUB.repoUrl(p).startsWith("https://github.com/alexwboles/"), "bad repo url");
  }));
});

// Flow 5: total value math matches hero ($271/mo)
flow("total value = 271", () => {
  assert.strictEqual(HUB.totalMonthly(), 271);
  const html = require("fs").readFileSync("index.html", "utf8");
  assert(html.includes("$271/mo"), "hero total missing");
});

// Flow 6: empty search returns everything; nonsense returns nothing
flow("search edge cases", () => {
  assert.strictEqual(HUB.search("").length, 15, "empty search");
  assert.strictEqual(HUB.search("zzz-no-such-thing").length, 0, "nonsense search");
});

// Flow 7: case-insensitive search
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
