/* ==========================================================
   Maria Doces - configuração e comportamentos gerais
   ========================================================== */

/* ----------------------------------------------------------
   CONFIGURAÇÃO (único lugar para editar o WhatsApp)
   Formato: DDI + DDD + número, só dígitos.
   ---------------------------------------------------------- */
const CONFIG = {
  whatsappNumber: "5531972003463", // (31) 97200-3463
};

(function () {
  "use strict";

  /* Links do WhatsApp: todo elemento com [data-whatsapp] */
  function buildWhatsAppUrl(message) {
    var digits = String(CONFIG.whatsappNumber || "").replace(/\D/g, "");
    var base = digits ? "https://wa.me/" + digits : "https://wa.me/";
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  function setupWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
      link.href = buildWhatsAppUrl(link.getAttribute("data-msg"));
    });
  }

  /* Imagens: marca quando carregou ou quando o arquivo ainda não existe */
  function markImage(img) {
    var holder = img.closest(".card__media, .avatar");
    var brand = img.closest(".brand");

    function ok() {
      img.classList.remove("is-missing");
      if (holder) holder.classList.add("has-image");
      if (brand) brand.classList.add("has-logo");
      document.dispatchEvent(new CustomEvent("images:changed"));
    }
    function fail() {
      img.classList.add("is-missing");
      if (holder) holder.classList.remove("has-image");
      if (brand) brand.classList.remove("has-logo");
    }

    if (img.complete) {
      if (img.naturalWidth > 0) ok(); else fail();
    } else {
      img.addEventListener("load", ok, { once: true });
      img.addEventListener("error", fail, { once: true });
    }
  }

  function setupImages() {
    document.querySelectorAll("img").forEach(markImage);
  }

  function setupFooterYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function setupHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function init() {
    setupWhatsAppLinks();
    setupImages();
    setupFooterYear();
    setupHeaderShadow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
