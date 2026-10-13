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

  var finder = { q: "", hub: "", sort: "az" };
  var favOnly = false;
  var FAV_KEY = "aivh:favs";
  var favs = {};

  function loadFavs() {
    try {
      var raw = localStorage.getItem(FAV_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      favs = {};
      (Array.isArray(arr) ? arr : []).forEach(function (s) { favs[s] = true; });
    } catch (e) { favs = {}; }
  }
  function saveFavs() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(Object.keys(favs))); }
    catch (e) { /* storage blocked: favorites just won't persist */ }
  }
  function isFav(slug) { return !!favs[slug]; }
  function toggleFav(slug) {
    if (favs[slug]) delete favs[slug]; else favs[slug] = true;
    saveFavs();
  }
  function favCount() { return Object.keys(favs).length; }

  function renderProducts() {
    var list = document.getElementById("products");
    var items = HUB.sortProducts(HUB.filterProducts(finder.q, finder.hub), finder.sort);
    if (favOnly) items = items.filter(function (p) { return isFav(p.slug); });
    document.getElementById("prodCount").textContent =
      "Showing " + items.length + " of " + HUB.PRODUCTS.length + " products" +
      (favOnly ? " (saved only)" : "");
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<li class="empty">' +
        (favOnly && !finder.q && !finder.hub
          ? "No saved products yet — tap the ★ on any product to save it here."
          : "No products match — try a different search or hub.") + "</li>";
      return;
    }
    items.forEach(function (p) {
      var hub = HUB.hubOfProduct(p.slug);
      var li = document.createElement("li");
      li.setAttribute("data-slug", p.slug);
      li.innerHTML =
        '<button class="fav-star' + (isFav(p.slug) ? " on" : "") + '" data-fav="' + esc(p.slug) + '"' +
        ' aria-pressed="' + (isFav(p.slug) ? "true" : "false") + '" title="Save this product">★</button>' +
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
    list.querySelectorAll("[data-fav]").forEach(function (b) {
      b.addEventListener("click", function () {
        toggleFav(b.getAttribute("data-fav"));
        renderProducts();
        syncFavBtn();
      });
    });
  }

  function syncFavBtn() {
    var b = document.getElementById("favOnlyBtn");
    if (!b) return;
    b.setAttribute("aria-pressed", favOnly ? "true" : "false");
    b.classList.toggle("pressed", favOnly);
    b.textContent = "★ Saved" + (favCount() ? " (" + favCount() + ")" : "");
  }

  function surprise() {
    var p = HUB.randomProduct();
    finder.q = ""; finder.hub = ""; finder.sort = "az";
    document.getElementById("prodSearch").value = "";
    document.getElementById("hubFilter").value = "";
    document.getElementById("sortSel").value = "az";
    favOnly = false; syncFavBtn();
    renderProducts(); syncHash();
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
    // Restore a shared finder state from the URL hash, if present.
    var st = HUB.hashToState(window.location.hash);
    finder.q = st.q; finder.hub = st.hub; finder.sort = st.sort;
    document.getElementById("prodSearch").value = st.q;
    sel.value = st.hub;
    document.getElementById("sortSel").value = st.sort;

    document.getElementById("prodSearch").addEventListener("input", function (e) {
      finder.q = e.target.value;
      renderProducts(); syncHash();
    });
    sel.addEventListener("change", function (e) {
      finder.hub = e.target.value;
      renderProducts(); syncHash();
    });
    document.getElementById("sortSel").addEventListener("change", function (e) {
      finder.sort = e.target.value;
      renderProducts(); syncHash();
    });
    document.getElementById("favOnlyBtn").addEventListener("click", function () {
      favOnly = !favOnly;
      renderProducts(); syncFavBtn();
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

  // Keep the URL hash in sync with the finder so a filtered view is shareable.
  function syncHash() {
    var h = HUB.stateToHash(finder);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", h || window.location.pathname + window.location.search);
    } else {
      window.location.hash = h;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHubs();
    loadFavs();
    initFinder();
    syncFavBtn();
    renderProducts();
  });
})();
