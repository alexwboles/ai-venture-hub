// ai-venture-hub — "The Dispatch": masthead, hub index cards, leaderboard
// finder (search / hub chips / sort / saved / surprise), and a Product-Hunt-
// style detail modal with related tools. Pure catalogue logic stays in data.js.
(function () {
  var HUB = window.HUB;
  if (!HUB) return;

  var HUB_COLORS = {
    "trades-hub": "#9a3412",
    "growth-hub": "#166534",
    "ops-hub": "#0e7490",
    "life-hub": "#7c2d12"
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function numWord(n) {
    var words = ["zero","one","two","three","four","five","six","seven","eight","nine","ten",
      "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
    if (n <= 20) return words[n];
    var tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
    var t = Math.floor(n / 10), r = n % 10;
    return tens[t] + (r ? "-" + words[r] : "");
  }

  /* --- header: stats + dateline ------------------------------------------- */
  function renderHeader() {
    var total = HUB.PRODUCTS.length;
    var stats = document.getElementById("stats");
    var cells = [
      [String(total), "independent tools"],
      [String(HUB.HUBS.length), "logical hubs"],
      ["$0", "to run — free forever"]
    ];
    stats.innerHTML = cells.map(function (c) {
      return '<div class="stat"><b>' + esc(c[0]) + "</b><span>" + esc(c[1]) + "</span></div>";
    }).join("");
    var hero = document.querySelector(".hero h1");
    if (hero) {
      hero.innerHTML = esc(numWord(total).charAt(0).toUpperCase() + numWord(total).slice(1)) +
        " independent tools,<br>each free to run.";
    }
    var dl = document.getElementById("dateline");
    if (dl) dl.textContent = "Independent tools, each free to run · " + total + " and counting.";
    var search = document.getElementById("prodSearch");
    if (search) search.placeholder = "Search " + total + " products…  ( press / )";
  }

  /* --- hub cards ----------------------------------------------------------- */
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
      if (HUB_COLORS[h.slug]) card.style.setProperty("--hubcolor", HUB_COLORS[h.slug]);
      card.innerHTML =
        "<h3>" + esc(h.name) + ' <span class="hub-count">' + h.members.length + " tools</span></h3>" +
        '<p class="hub-blurb">' + esc(h.blurb) + "</p>" +
        '<p class="hub-members">' + members + "</p>" +
        '<a class="btn hub-open" href="' + HUB.hubUrl(h) + '" target="_blank" rel="noopener">Open hub →</a>';
      wrap.appendChild(card);
    });
  }

  /* --- favorites ----------------------------------------------------------- */
  var FAV_KEY = "aivh:favs";
  var favs = {};
  function loadFavs() {
    try {
      var arr = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
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

  /* --- finder state -------------------------------------------------------- */
  var finder = { q: "", hub: "", sort: "az" };
  var favOnly = false;

  function renderChips() {
    var wrap = document.getElementById("hubChips");
    wrap.innerHTML = "";
    var all = [{ slug: "", name: "All tools", members: HUB.PRODUCTS }].concat(HUB.HUBS);
    all.forEach(function (h) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute("role", "radio");
      var active = finder.hub === h.slug;
      b.setAttribute("aria-checked", active ? "true" : "false");
      b.textContent = h.name + " (" + h.members.length + ")";
      (function (slug) {
        b.addEventListener("click", function () {
          finder.hub = slug;
          favOnly = false;
          renderChips(); renderProducts(); syncFavBtn(); syncHash();
        });
      })(h.slug);
      wrap.appendChild(b);
    });
  }

  function renderProducts() {
    var list = document.getElementById("products");
    var items = HUB.sortProducts(HUB.filterProducts(finder.q, finder.hub), finder.sort);
    if (favOnly) items = items.filter(function (p) { return isFav(p.slug); });
    document.getElementById("prodCount").textContent =
      "Showing " + items.length + " of " + HUB.PRODUCTS.length + " products" +
      (favOnly ? " (saved only)" : "") +
      (finder.hub ? " in " + (HUB.HUBS.filter(function (h) { return h.slug === finder.hub; })[0] || {}).name : "");
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<li class="empty">' +
        (favOnly && !finder.q && !finder.hub
          ? "No saved products yet — tap the ★ on any product to save it here."
          : "No products match — try a different search or hub.") + "</li>";
      return;
    }
    items.forEach(function (p, i) {
      var hub = HUB.hubOfProduct(p.slug);
      var li = document.createElement("li");
      li.setAttribute("data-slug", p.slug);
      var color = hub && HUB_COLORS[hub.slug] ? ' style="--hubcolor:' + HUB_COLORS[hub.slug] + '"' : "";
      li.innerHTML =
        '<span class="rank" aria-hidden="true">' + (i + 1) + "</span>" +
        '<button class="fav-star' + (isFav(p.slug) ? " on" : "") + '" data-fav="' + esc(p.slug) + '"' +
        ' aria-pressed="' + (isFav(p.slug) ? "true" : "false") + '" title="Save this product">★</button>' +
        '<div class="row-main">' +
          '<a class="row-name" href="#" data-detail="' + esc(p.slug) + '">' + esc(p.name) + "</a>" +
          '<p class="row-tag">' + esc(p.tagline) + "</p>" +
        "</div>" +
        '<div class="row-side"' + color + ">" +
          (hub ? '<span class="hub-tag">' + esc(hub.name) + "</span>" : '<span class="hub-tag">Unfiled</span>') +
          '<button class="row-btn" data-detail="' + esc(p.slug) + '">Details</button>' +
          '<a class="row-btn" href="' + HUB.repoUrl(p) + '" target="_blank" rel="noopener">Repo ↗</a>' +
          '<button class="row-btn copy-link" data-url="' + HUB.repoUrl(p) + '" title="Copy repo link">Copy link</button>' +
        "</div>";
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
    list.querySelectorAll("[data-detail]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        openModal(b.getAttribute("data-detail"));
      });
    });
  }

  /* --- detail modal -------------------------------------------------------- */
  var lastFocus = null;
  function openModal(slug) {
    var p = HUB.productBySlug(slug);
    if (!p) return;
    lastFocus = document.activeElement;
    var hub = HUB.hubOfProduct(p.slug);
    document.getElementById("modalKicker").textContent = hub ? hub.name : "Unfiled tool";
    document.getElementById("modalName").textContent = p.name;
    document.getElementById("modalTagline").textContent = p.tagline;
    var repo = document.getElementById("modalRepo");
    repo.href = HUB.repoUrl(p);
    var favBtn = document.getElementById("modalFav");
    function paintFav() {
      favBtn.setAttribute("aria-pressed", isFav(slug) ? "true" : "false");
      favBtn.textContent = isFav(slug) ? "★ Saved ✓" : "★ Save";
    }
    paintFav();
    favBtn.onclick = function () { toggleFav(slug); paintFav(); renderProducts(); syncFavBtn(); };
    var copyBtn = document.getElementById("modalCopy");
    copyBtn.textContent = "Copy link";
    copyBtn.onclick = function () {
      var url = HUB.repoUrl(p);
      var done = function () {
        copyBtn.textContent = "Copied";
        setTimeout(function () { copyBtn.textContent = "Copy link"; }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else { done(); }
    };
    var rel = document.getElementById("modalRelated");
    var relBox = rel.parentNode;
    rel.innerHTML = "";
    if (hub) {
      relBox.style.display = "";
      HUB.filterProducts("", hub.slug)
        .filter(function (x) { return x.slug !== slug; })
        .slice(0, 4)
        .forEach(function (x) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = "#";
          a.innerHTML = esc(x.name) + "<span>" + esc(x.tagline) + "</span>";
          (function (s) {
            a.addEventListener("click", function (ev) { ev.preventDefault(); openModal(s); });
          })(x.slug);
          li.appendChild(a);
          rel.appendChild(li);
        });
    } else {
      relBox.style.display = "none";
    }
    document.getElementById("modalBackdrop").hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
  }
  function closeModal() {
    document.getElementById("modalBackdrop").hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* --- finder wiring ------------------------------------------------------- */
  function syncFavBtn() {
    var b = document.getElementById("favOnlyBtn");
    if (b) {
      b.setAttribute("aria-pressed", favOnly ? "true" : "false");
      b.classList.toggle("pressed", favOnly);
      b.textContent = "★ Saved" + (favCount() ? " (" + favCount() + ")" : "");
    }
    var mp = document.getElementById("mastheadSaved");
    if (mp) {
      mp.setAttribute("data-active", favOnly ? "true" : "false");
      document.getElementById("mastheadSavedCount").textContent = favCount();
    }
  }

  function setFavOnly(v) {
    favOnly = v;
    renderProducts();
    syncFavBtn();
    var bar = document.getElementById("finderbar");
    if (v && bar) bar.scrollIntoView({ block: "start" });
  }

  function surprise() {
    var p = HUB.randomProduct();
    finder.q = ""; finder.hub = ""; finder.sort = "az";
    document.getElementById("prodSearch").value = "";
    document.getElementById("sortSel").value = "az";
    favOnly = false;
    renderChips(); renderProducts(); syncFavBtn(); syncHash();
    var li = document.querySelector('#products li[data-slug="' + p.slug + '"]');
    if (!li) return;
    li.classList.add("spotlight");
    li.scrollIntoView({ block: "center", behavior: "smooth" });
    setTimeout(function () { li.classList.remove("spotlight"); }, 2600);
  }

  function initFinder() {
    // Restore a shared finder state from the URL hash, if present.
    var st = HUB.hashToState(window.location.hash);
    finder.q = st.q; finder.hub = st.hub; finder.sort = st.sort;
    document.getElementById("prodSearch").value = st.q;
    document.getElementById("sortSel").value = st.sort;
    renderChips();

    document.getElementById("prodSearch").addEventListener("input", function (e) {
      finder.q = e.target.value;
      renderProducts(); syncHash();
    });
    document.getElementById("sortSel").addEventListener("change", function (e) {
      finder.sort = e.target.value;
      renderProducts(); syncHash();
    });
    document.getElementById("favOnlyBtn").addEventListener("click", function () { setFavOnly(!favOnly); });
    document.getElementById("mastheadSaved").addEventListener("click", function () { setFavOnly(!favOnly); });
    document.getElementById("surpriseBtn").addEventListener("click", surprise);
    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("modalBackdrop").addEventListener("click", function (e) {
      if (e.target.id === "modalBackdrop") closeModal();
    });
    // "/" focuses search from anywhere (unless typing already); Esc clears / closes.
    document.addEventListener("keydown", function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      var modalOpen = !document.getElementById("modalBackdrop").hidden;
      if (e.key === "Escape") {
        if (modalOpen) { closeModal(); return; }
        if (tag === "INPUT" && document.activeElement.id === "prodSearch" && finder.q) {
          finder.q = "";
          document.getElementById("prodSearch").value = "";
          renderProducts(); syncHash();
        }
        return;
      }
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag) && !modalOpen) {
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
    renderHeader();
    renderHubs();
    loadFavs();
    initFinder();
    syncFavBtn();
    renderProducts();
  });
})();
