/* =================================================================
   AZELEY — script.js
   Vanilla JS · aucune dépendance externe
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. ÉTAT DU HEADER AU SCROLL ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });


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

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // une seule fois
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => observer.observe(el));
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

});
