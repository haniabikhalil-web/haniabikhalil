/* haniabikhalil.com — small interactions only: mobile nav, About tabs, reveal. */

(function () {
  "use strict";

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----------------------------------------------------------- about tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[role='tab']"));

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.setAttribute("tabindex", selected ? "0" : "-1");
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
  }

  if (tabs.length) {
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        selectTab(tab);
        if (history.replaceState) {
          history.replaceState(null, "", "#" + tab.dataset.hash);
        }
      });

      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) {
          e.preventDefault();
          next.focus();
          selectTab(next);
        }
      });
    });

    var hash = (window.location.hash || "").replace("#", "");
    var fromHash = tabs.filter(function (t) { return t.dataset.hash === hash; })[0];
    selectTab(fromHash || tabs[0]);
  }

  /* -------------------------------------------------------------- reveal */
  var revealables = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || !revealables.length) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  Array.prototype.forEach.call(revealables, function (el) { observer.observe(el); });

  /* ------------------------------------------------------- footer year */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
