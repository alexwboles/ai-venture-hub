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
        "<h3>" + esc(h.name) + "</h3>" +
        '<p class="hub-blurb">' + esc(h.blurb) + "</p>" +
        '<p class="hub-members">' + members + "</p>" +
        '<a class="btn" href="' + HUB.hubUrl(h) + '" target="_blank" rel="noopener">Open hub →</a>';
      wrap.appendChild(card);
    });
  }

  function renderProducts() {
    var list = document.getElementById("products");
    HUB.PRODUCTS.forEach(function (p) {
      var li = document.createElement("li");
      li.innerHTML =
        '<a href="' + HUB.repoUrl(p) + '" target="_blank" rel="noopener">' + esc(p.name) + "</a>" +
        " — " + esc(p.tagline);
      list.appendChild(li);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHubs();
    renderProducts();
  });
})();
