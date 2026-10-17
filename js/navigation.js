/* ==========================================================
   Maria Doces - menu hambúrguer e destaque do link ativo
   ========================================================== */
(function () {
  "use strict";

  function init() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("menu-principal");
    if (!toggle || !nav) return;

    var desktop = window.matchMedia("(min-width: 900px)");
    var links = nav.querySelectorAll("a");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      document.dispatchEvent(new CustomEvent("menu:toggle", { detail: { open: open } }));
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        if (toggle.getAttribute("aria-expanded") === "true") setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Ao ir para o desktop, fecha o painel mobile */
    function onBreakpoint(e) { if (e.matches) setOpen(false); }
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else desktop.addListener(onBreakpoint);

    /* Link ativo conforme a seção visível */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            var active = a.getAttribute("href") === "#" + entry.target.id;
            a.classList.toggle("is-active", active);
            if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { observer.observe(s); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
