// AI Venture Hub — portfolio UI: cluster-grouped rendering + filtering (browser only)
(function () {
  var HUB = window.HUB;
  var state = { q: "", cluster: "all" };

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
    var c = HUB.clusterById(p.cluster);
    var card = el("article", "card cluster-" + p.cluster);
    card.innerHTML =
      '<div class="card-top"><span class="badge badge-' + p.cluster + '">' + esc(c ? c.short : p.cluster) + "</span>" +
      '<span class="price">' + esc(HUB.priceLabel(p)) + "</span></div>" +
      '<h3>' + esc(p.name) + '</h3><p class="tagline">' + esc(p.tagline) + "</p>" +
      '<ul class="feats">' + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
      '<a class="btn" href="' + HUB.repoUrl(p) + '" target="_blank" rel="noopener">View repo →</a>';
    return card;
  }

  function clusterSection(c, products) {
    var sec = el("section", "cluster-sec");
    var val = HUB.clusterValue(c.id);
    var head = el("div", "cluster-head");
    head.innerHTML =
      "<h2>" + esc(c.name) + "</h2>" +
      '<p class="cluster-blurb">' + esc(c.blurb) + "</p>" +
      '<p class="cluster-value">' + products.length + " products · " +
        (val === 0 ? "free" : "$" + val + "/mo combined value") + "</p>";
    sec.appendChild(head);
    var grid = el("div", "grid");
    products.forEach(function (p) { grid.appendChild(productCard(p)); });
    sec.appendChild(grid);
    return sec;
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
      '<p class="why"><b>Why these go together:</b> ' + esc(s.why) + "</p>" +
      '<div class="stack-products">' + names.join(" <span class='plus'>+</span> ") + "</div>" +
      '<div class="stack-value">' + (sum === 0 ? "Free stack" : "$" + sum + "/mo value if bought separately") + "</div>";
    return card;
  }

  function render() {
    var list = HUB.search(state.q);
    var main = document.getElementById("clusters");
    main.innerHTML = "";
    var shown = 0;
    HUB.CLUSTERS.forEach(function (c) {
      if (state.cluster !== "all" && state.cluster !== c.id) return;
      var ps = list.filter(function (p) { return p.cluster === c.id; });
      if (!ps.length) return;
      shown += ps.length;
      main.appendChild(clusterSection(c, ps));
    });
    if (!shown) {
      main.innerHTML = '<p class="empty">Nothing matches — try a different search.</p>';
    }
    document.getElementById("count").textContent = shown + " of " + HUB.PRODUCTS.length + " products";
  }

  function init() {
    // stats
    document.getElementById("prod-count").textContent = HUB.PRODUCTS.length;
    document.getElementById("cluster-count").textContent = HUB.CLUSTERS.length;

    // cluster chips
    var chipsEl = document.getElementById("chips");
    chipsEl.innerHTML = "";
    var mk = function (id, label) {
      var b = el("button", "chip" + (id === "all" ? " active" : ""));
      b.dataset.cluster = id; b.textContent = label;
      b.addEventListener("click", function () {
        chipsEl.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        state.cluster = id; render();
      });
      chipsEl.appendChild(b);
    };
    mk("all", "All");
    HUB.CLUSTERS.forEach(function (c) { mk(c.id, c.name); });

    // stacks
    var stacksEl = document.getElementById("stacks");
    stacksEl.innerHTML = "";
    HUB.STACKS.forEach(function (s) { stacksEl.appendChild(stackCard(s)); });

    // search
    document.getElementById("search").addEventListener("input", function (e) {
      state.q = e.target.value; render();
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
