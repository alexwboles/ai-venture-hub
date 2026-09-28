// AI Venture Hub — UI rendering + filtering (browser only)
(function () {
  var HUB = window.HUB;
  var state = { q: "", cat: "all" };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function productCard(p) {
    var card = el("article", "card " + p.cat);
    card.innerHTML =
      '<div class="card-top"><span class="badge ' + p.cat + '">' + (p.cat === "business" ? "Business" : "Personal") + "</span>" +
      '<span class="price">' + esc(HUB.priceLabel(p)) + "</span></div>" +
      '<h3>' + esc(p.name) + '</h3><p class="tagline">' + esc(p.tagline) + "</p>" +
      '<ul class="feats">' + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
      '<a class="btn" href="' + HUB.repoUrl(p) + '" target="_blank" rel="noopener">View repo →</a>';
    return card;
  }

  function stackCard(s) {
    var names = s.products.map(function (slug) {
      var p = HUB.PRODUCTS.find(function (x) { return x.slug === slug; });
      return p ? '<a href="' + HUB.repoUrl(p) + '" target="_blank" rel="noopener">' + esc(p.name) + "</a>" : esc(slug);
    });
    var sum = s.products.reduce(function (acc, slug) {
      var p = HUB.PRODUCTS.find(function (x) { return x.slug === slug; });
      return acc + (p ? p.price : 0);
    }, 0);
    var card = el("article", "stack");
    card.innerHTML =
      "<h3>" + esc(s.name) + '</h3><p class="pitch">' + esc(s.pitch) + "</p>" +
      '<div class="stack-products">' + names.join(" <span class='plus'>+</span> ") + "</div>" +
      '<div class="stack-value">' + (sum === 0 ? "Free stack" : "$" + sum + "/mo value if bought separately") + "</div>";
    return card;
  }

  function render() {
    var list = HUB.search(state.q).filter(function (p) {
      return state.cat === "all" || p.cat === state.cat;
    });
    var grid = document.getElementById("grid");
    grid.innerHTML = "";
    if (!list.length) {
      grid.innerHTML = '<p class="empty">Nothing matches — try a different search.</p>';
    } else {
      list.forEach(function (p) { grid.appendChild(productCard(p)); });
    }
    document.getElementById("count").textContent = list.length + " of " + HUB.PRODUCTS.length + " products";
  }

  function init() {
    // value counter
    var total = HUB.totalMonthly();
    document.getElementById("total-value").textContent = "$" + total + "/mo";
    document.getElementById("biz-count").textContent = HUB.byCat("business").length;
    document.getElementById("per-count").textContent = HUB.byCat("personal").length;

    // stacks
    var stacksEl = document.getElementById("stacks");
    HUB.STACKS.forEach(function (s) { stacksEl.appendChild(stackCard(s)); });

    // search
    document.getElementById("search").addEventListener("input", function (e) {
      state.q = e.target.value; render();
    });
    // chips
    document.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        state.cat = chip.dataset.cat; render();
      });
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
