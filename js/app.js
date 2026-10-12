// ai-venture-hub — minimal index rendering: 4 hub cards + alphabetical product list
(function () {
  var HUB = window.HUB;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderHubs() {
    var wrap = document.getElementById("hubs");
    HUB.HUBS.forEach(function (h) {
      var members = h.members.map(function (slug) {
        var p = HUB.productBySlug(slug);
        return p
          ? '<a href="' + HUB.repoUrl(p) + '" target="_blank" rel="noopener">' + esc(p.name) + "</a>"
          : esc(slug);
      }).join(" · ");
      var card = document.createElement("article");
      card.className = "hub-card";
      card.innerHTML =
        "<h3>" + esc(h.name) + ' <span class="hub-count">' + h.members.length + " tools</span></h3>" +
        '<p class="hub-blurb">' + esc(h.blurb) + "</p>" +
        '<p class="hub-members">' + members + "</p>" +
        '<a class="btn" href="' + HUB.hubUrl(h) + '" target="_blank" rel="noopener">Open hub →</a>';
      wrap.appendChild(card);
    });
  }

  var finder = { q: "", hub: "" };

  function renderProducts() {
    var list = document.getElementById("products");
    var items = HUB.filterProducts(finder.q, finder.hub);
    document.getElementById("prodCount").textContent =
      "Showing " + items.length + " of " + HUB.PRODUCTS.length + " products";
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<li class="empty">No products match — try a different search or hub.</li>';
      return;
    }
    items.forEach(function (p) {
      var hub = HUB.hubOfProduct(p.slug);
      var li = document.createElement("li");
      li.setAttribute("data-slug", p.slug);
      li.innerHTML =
        '<a href="' + HUB.repoUrl(p) + '" target="_blank" rel="noopener">' + esc(p.name) + "</a>" +
        " — " + esc(p.tagline) +
        (hub ? ' <span class="hub-tag">' + esc(hub.name) + "</span>" : "") +
        ' <button class="copy-link" data-url="' + HUB.repoUrl(p) + '" title="Copy repo link">Copy link</button>';
      list.appendChild(li);
    });
    list.querySelectorAll(".copy-link").forEach(function (b) {
      b.addEventListener("click", function () {
        var done = function () {
          b.textContent = "Copied";
          setTimeout(function () { b.textContent = "Copy link"; }, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(b.getAttribute("data-url")).then(done, done);
        } else { done(); }
      });
    });
  }

  function surprise() {
    var p = HUB.randomProduct();
    finder.q = ""; finder.hub = "";
    document.getElementById("prodSearch").value = "";
    document.getElementById("hubFilter").value = "";
    renderProducts();
    var li = document.querySelector('#products li[data-slug="' + p.slug + '"]');
    if (!li) return;
    li.classList.add("spotlight");
    li.scrollIntoView({ block: "center", behavior: "smooth" });
    setTimeout(function () { li.classList.remove("spotlight"); }, 2600);
  }

  function initFinder() {
    var sel = document.getElementById("hubFilter");
    HUB.HUBS.forEach(function (h) {
      var o = document.createElement("option");
      o.value = h.slug;
      o.textContent = h.name + " (" + h.members.length + ")";
      sel.appendChild(o);
    });
    document.getElementById("prodSearch").addEventListener("input", function (e) {
      finder.q = e.target.value;
      renderProducts();
    });
    sel.addEventListener("change", function (e) {
      finder.hub = e.target.value;
      renderProducts();
    });
    document.getElementById("surpriseBtn").addEventListener("click", surprise);
    // "/" focuses search from anywhere (unless typing already)
    document.addEventListener("keydown", function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
        e.preventDefault();
        document.getElementById("prodSearch").focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHubs();
    initFinder();
    renderProducts();
  });
})();
