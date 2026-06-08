/* =================================================================
   AZELEY — script.js
   Vanilla JS · aucune dépendance externe
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. ÉTAT DU HEADER AU SCROLL (+ bouton retour en haut) ---------- */
  const header = document.getElementById('header');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ---------- 2. MENU MOBILE (burger) ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  const toggleMenu = (force) => {
    const open = force ?? !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  burger.addEventListener('click', () => toggleMenu());

  // Ferme le menu après un clic sur un lien
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Ferme le menu avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });


  /* ---------- 3. RÉVÉLATIONS AU SCROLL (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  let revealObserver = null;

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // une seule fois
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Repli : tout afficher si l'API n'existe pas
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  /* ---------- 4. T-SHIRT SIGNATURE : bascule devant / dos ---------- */
  const toggleBtns = document.querySelectorAll('.toggle__btn');
  const tees = document.querySelectorAll('.tee');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const face = btn.dataset.face;

      toggleBtns.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      tees.forEach(tee => {
        tee.classList.toggle('is-active', tee.dataset.face === face);
      });

      // #3 : (re)trace le plan de Paris quand on affiche le dos
      if (face === 'back') {
        const paris = document.querySelector('.tee--back .paris');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (paris && !reduce) {
          paris.classList.remove('is-drawing');
          void paris.offsetWidth; // force un reflow pour rejouer l'animation
          paris.classList.add('is-drawing');
        }
      }
    });
  });


  /* ---------- 5. FORMULAIRE DE CONTACT (vitrine statique) ---------- */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.elements['name'];
      const email = form.elements['email'];
      const message = form.elements['message'];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Réinitialise les états d'erreur
      [name, email, message].forEach(f => f.classList.remove('is-error'));

      let valid = true;
      if (!name.value.trim())            { name.classList.add('is-error');    valid = false; }
      if (!emailRegex.test(email.value)) { email.classList.add('is-error');   valid = false; }
      if (!message.value.trim())         { message.classList.add('is-error'); valid = false; }

      if (!valid) {
        feedback.style.color = 'var(--rouge)';
        feedback.textContent = '// Vérifie les champs en rouge.';
        return;
      }

      // Site vitrine : pas de back-end. On simule l'envoi.
      // Pour un vrai envoi : branche Formspree, EmailJS ou une API.
      feedback.style.color = 'var(--or)';
      feedback.textContent = '// Message bien reçu — on revient vers toi. Merci.';
      form.reset();
    });
  }


  /* ---------- 6. ANNÉE DYNAMIQUE DU FOOTER ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------- 7. DROP : compte à rebours + inscription (UI seule) ---------- */
  const dropCount = document.getElementById('dropCount');
  if (dropCount) {
    // Date cible du prochain drop — à ajuster librement
    const target = new Date('2026-09-01T19:00:00').getTime();
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { dropCount.textContent = 'Le drop est lancé.'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff % 86400000 / 3600000);
      const m = Math.floor(diff % 3600000 / 60000);
      const s = Math.floor(diff % 60000 / 1000);
      dropCount.textContent = `${d}j ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    };
    tick();
    setInterval(tick, 1000);
  }

  const dropForm = document.getElementById('dropForm');
  const dropFeedback = document.getElementById('dropFeedback');
  if (dropForm) {
    dropForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = dropForm.elements['email'];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      email.classList.remove('is-error');
      if (!emailRegex.test(email.value)) {
        email.classList.add('is-error');
        dropFeedback.style.color = 'var(--rouge)';
        dropFeedback.textContent = '// Email invalide.';
        return;
      }
      // UI seule : aucun back-end. Pour un vrai envoi, brancher un service ici.
      dropFeedback.style.color = 'var(--or)';
      dropFeedback.textContent = '// Tu es sur la liste. On te prévient au drop.';
      dropForm.reset();
    });
  }


  /* ---------- 8. CURSEUR PERSONNALISÉ (desktop uniquement) ---------- */
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor = document.getElementById('cursor');
  if (cursor && finePointer && !reduceMotion) {
    cursor.classList.add('is-active');
    let cx = 0, cy = 0, raf = null;
    const render = () => { cursor.style.transform = `translate(${cx}px, ${cy}px)`; raf = null; };
    window.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });
    const interactive = 'a, button, input, textarea, .toggle__btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactive)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactive)) cursor.classList.remove('is-hover');
    });
  }


  /* ---------- 9. HERO : logo réactif à la souris ---------- */
  const heroEl = document.getElementById('hero');
  const brandMark = document.querySelector('.hero__brand-mark');
  if (heroEl && brandMark && finePointer && !reduceMotion) {
    heroEl.addEventListener('mousemove', (e) => {
      const r = heroEl.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - .5;
      const dy = (e.clientY - r.top) / r.height - .5;
      brandMark.style.transform = `translate(${dx * 18}px, ${dy * 14}px) rotate(${dx * 2}deg)`;
    });
    heroEl.addEventListener('mouseleave', () => { brandMark.style.transform = ''; });
  }


  /* ---------- 10. PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hide = () => {
      preloader.classList.add('is-done');
      setTimeout(() => preloader.remove(), 700);
    };
    if (reduceMotion) {
      hide();
    } else {
      window.addEventListener('load', hide);
      setTimeout(hide, 2500); // filet de sécurité si "load" traîne
    }
  }


  /* ---------- 11. MANIFESTE CINÉTIQUE (apparition mot à mot) ---------- */
  const manifesto = document.querySelector('.mentalite__manifesto');
  if (manifesto && !reduceMotion && revealObserver) {
    let i = 0;
    const wrapTextNode = (node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (part === '' || /^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part)); // conserve les espaces
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.setProperty('--d', (i++ * 0.03).toFixed(2) + 's');
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    };
    // On n'enveloppe que les nœuds texte directs : les <em> restent intacts
    Array.from(manifesto.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) wrapTextNode(node);
    });
    manifesto.querySelectorAll('.word').forEach(w => revealObserver.observe(w));
  }

});
