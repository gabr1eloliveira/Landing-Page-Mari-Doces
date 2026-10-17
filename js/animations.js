/* ==========================================================
   Maria Doces - animações
   GSAP + ScrollTrigger: entrada do hero, títulos, revelação de imagens e seções
   Anime.js: decorativos, microinterações de botões, menu mobile, botão de WhatsApp
   ========================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var hasAnime = typeof window.anime !== "undefined";

  /* Sem movimento ou sem bibliotecas: o site continua totalmente utilizável */
  if (reduceMotion || (!hasGsap && !hasAnime)) return;

  document.documentElement.classList.add("anim-ready");

  /* ---------- Utilitário: separa títulos em letras ---------- */
  function splitWords(el) {
    var text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    var words = text.split(/\s+/);
    var letters = [];
    words.forEach(function (word, i) {
      var mask = document.createElement("span");
      mask.className = "word-mask";
      mask.setAttribute("aria-hidden", "true");
      var wordEl = document.createElement("span");
      wordEl.className = "word";
      Array.from(word).forEach(function (character) {
        var letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = character;
        wordEl.appendChild(letter);
        letters.push(letter);
      });
      mask.appendChild(wordEl);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    return letters;
  }

  /* ======================== GSAP ======================== */
  function setupGsap() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out" });

    /* --- Hero: entrada sequencial --- */
    var heroTitle = document.querySelector(".hero__title");
    var heroLetters = heroTitle ? splitWords(heroTitle) : [];
    var tl = gsap.timeline({ delay: 0.15 });

    tl.from(".site-header .brand, .site-header .nav__link, .site-header .menu-toggle, .site-header .nav .btn", {
      y: -16, opacity: 0, duration: 0.5, stagger: 0.06, clearProps: "all"
    });
    tl.from("[data-hero='item']:first-child", { y: 18, opacity: 0, duration: 0.5 }, "-=0.2");
    if (heroLetters.length) {
      tl.from(heroLetters, { yPercent: 110, duration: 0.7, stagger: 0.025, ease: "power4.out" }, "-=0.25");
    }
    tl.from(".hero__lead, .hero__actions", { y: 22, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.4");
    tl.from(".avatar", {
      clipPath: "inset(100% 0% 0% 0% round 999px 999px 24px 24px)",
      scale: 1.06,
      duration: 1,
      ease: "power3.inOut",
      clearProps: "clipPath,scale"
    }, 0.35);

    /* --- Títulos de seção --- */
    gsap.utils.toArray(".section__title, .cta__title").forEach(function (title) {
      var letters = splitWords(title);
      gsap.from(letters, {
        yPercent: 110,
        duration: 0.7,
        stagger: 0.02,
        ease: "power4.out",
        scrollTrigger: { trigger: title, start: "top 85%", once: true }
      });
    });

    gsap.utils.toArray(".section__head .eyebrow, .location__text .eyebrow, .section__lead").forEach(function (el) {
      gsap.from(el, { y: 18, opacity: 0, duration: 0.6, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });

    /* --- Cardápio: cards em sequência e revelação das imagens --- */
    gsap.utils.toArray(".card").forEach(function (card, i) {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        rotate: i % 2 === 0 ? -1.2 : 1.2,
        duration: 0.9,
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
        clearProps: "transform,opacity"
      });
      gsap.from(card.querySelectorAll(".card__body > *"), {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        scrollTrigger: { trigger: card, start: "top 82%", once: true }
      });
    });

    gsap.utils.toArray(".reveal-img").forEach(function (fig) {
      var img = fig.querySelector("img");
      gsap.from(fig, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: fig, start: "top 88%", once: true },
        clearProps: "clipPath"
      });
      if (img) {
        gsap.from(img, {
          scale: 1.25,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: fig, start: "top 88%", once: true },
          clearProps: "transform"
        });
      }
    });

    /* --- Localização --- */
    gsap.from(".location__address, .location__actions", {
      y: 24, opacity: 0, duration: 0.7, stagger: 0.12,
      scrollTrigger: { trigger: ".location__text", start: "top 75%", once: true }
    });
    gsap.from(".location__map", {
      x: 60, opacity: 0, duration: 1,
      scrollTrigger: { trigger: ".location__map", start: "top 85%", once: true },
      clearProps: "transform,opacity"
    });

    /* --- Chamada final --- */
    gsap.from(".cta__side > *", {
      y: 28, opacity: 0, duration: 0.7, stagger: 0.14,
      scrollTrigger: { trigger: ".cta__side", start: "top 88%", once: true }
    });

    /* --- Rodapé --- */
    gsap.from(".footer__grid > *", {
      y: 24, opacity: 0, duration: 0.7, stagger: 0.12,
      scrollTrigger: { trigger: ".footer", start: "top 90%", once: true }
    });

    /* Parallax leve no avatar e no mapa */
    gsap.to(".hero__visual", {
      yPercent: -7,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
    });
    gsap.to(".location__map", {
      yPercent: -4,
      ease: "none",
      scrollTrigger: { trigger: ".location", start: "top bottom", end: "bottom top", scrub: 0.6 }
    });

    /* Imagens carregam depois: recalcula posições */
    document.addEventListener("images:changed", function () { ScrollTrigger.refresh(); });
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ======================== Anime.js ======================== */
  function setupAnime() {
    /* Decorativos: flutuação suave e desencontrada */
    document.querySelectorAll(".decor").forEach(function (el, i) {
      anime({
        targets: el,
        translateX: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 2)],
        scale: [1, 1.12],
        duration: 3200 + i * 450,
        delay: i * 250,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine"
      });
    });

    /* Botões: pequena resposta ao passar o mouse ou focar */
    document.querySelectorAll(".btn").forEach(function (btn) {
      function bump(scale) {
        anime.remove(btn);
        anime({ targets: btn, scale: scale, duration: 280, easing: "easeOutElastic(1, .7)" });
      }
      btn.addEventListener("mouseenter", function () { bump(1.05); });
      btn.addEventListener("mouseleave", function () { bump(1); });
      btn.addEventListener("focus", function () { bump(1.04); });
      btn.addEventListener("blur", function () { bump(1); });
    });

    /* Corações no ponto do clique, sem bloquear a abertura do WhatsApp */
    var heartLayer = document.createElement("div");
    heartLayer.className = "heart-burst-layer";
    heartLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(heartLayer);

    document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var bounds = link.getBoundingClientRect();
        var originX = event.clientX || bounds.left + bounds.width / 2;
        var originY = event.clientY || bounds.top + bounds.height / 2;
        var colors = ["#ed8afc", "#d94eea", "#a72bc0", "#ff6b9d"];

        for (var i = 0; i < 7; i += 1) {
          var heart = document.createElement("span");
          heart.className = "heart-burst";
          heart.textContent = "♥";
          heart.style.left = originX + "px";
          heart.style.top = originY + "px";
          heart.style.color = colors[i % colors.length];
          heartLayer.appendChild(heart);

          anime({
            targets: heart,
            translateX: anime.random(-70, 70),
            translateY: anime.random(-95, -35),
            rotate: anime.random(-35, 35),
            scale: [0.3, anime.random(0.85, 1.25), 0.6],
            opacity: [0, 1, 0],
            duration: anime.random(750, 1150),
            delay: i * 25,
            easing: "easeOutCubic",
            complete: function (animation) {
              animation.animatables[0].target.remove();
            }
          });
        }
      });
    });

    /* Menu mobile: links entram em sequência */
    document.addEventListener("menu:toggle", function (e) {
      if (!e.detail.open) return;
      anime.remove(".nav__list > li");
      anime({
        targets: ".nav__list > li",
        translateY: [28, 0],
        opacity: [0, 1],
        delay: anime.stagger(70, { start: 120 }),
        duration: 600,
        easing: "easeOutCubic"
      });
    });

    /* Botão flutuante: entrada e três pulsos discretos */
    var wa = document.querySelector(".wa-float");
    if (wa) {
      anime({
        targets: wa,
        scale: [0, 1],
        opacity: [0, 1],
        delay: 1400,
        duration: 700,
        easing: "easeOutElastic(1, .6)"
      });
      anime({
        targets: ".wa-float__pulse",
        scale: [1, 1.6],
        opacity: [0.6, 0],
        delay: 2400,
        duration: 1400,
        loop: 3,
        easing: "easeOutQuad"
      });
    }

    /* Cards: leve inclinação das imagens conforme o mouse (somente com mouse) */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll(".card").forEach(function (card) {
        card.addEventListener("mousemove", function (ev) {
          var r = card.getBoundingClientRect();
          var x = (ev.clientX - r.left) / r.width - 0.5;
          var y = (ev.clientY - r.top) / r.height - 0.5;
          anime({ targets: card.querySelector(".card__body"), translateX: x * 6, translateY: y * 6, duration: 300, easing: "easeOutQuad" });
        });
        card.addEventListener("mouseleave", function () {
          anime({ targets: card.querySelector(".card__body"), translateX: 0, translateY: 0, duration: 500, easing: "easeOutElastic(1, .7)" });
        });
      });
    }
  }

  function init() {
    if (hasGsap) setupGsap();
    if (hasAnime) setupAnime();
    if (!hasAnime) document.documentElement.classList.add("no-anime");
  }

  /* Os scripts das bibliotecas usam defer: aguarda tudo carregar */
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();
