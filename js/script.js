/* ═══════════════════════════════════════════
   JEI & ANGIE — Wedding Website JS
   ═══════════════════════════════════════════ */

/* ─── NAV: scroll effect ─── */
(function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─── MOBILE MENU ─── */
(function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const menu      = document.getElementById('mobileMenu');
  const close     = document.querySelector('.mobile-menu__close');
  const links     = menu.querySelectorAll('a');

  const openMenu  = () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  links.forEach(link => link.addEventListener('click', closeMenu));
})();


/* ─── FADE-IN ON SCROLL ─── */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => observer.observe(el));
})();


/* ─── GALLERY LIGHTBOX ─── */
(function initLightbox() {
  const grid     = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev  = lightbox.querySelector('.lightbox__prev');
  const btnNext  = lightbox.querySelector('.lightbox__next');

  const items = Array.from(grid.querySelectorAll('.gallery__item img'));
  let current = 0;

  function open(idx) {
    current = ((idx % items.length) + items.length) % items.length;
    lbImg.src = items[current].src;
    lbImg.alt = items[current].alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    items[current].closest('.gallery__item').focus();
  }

  function prev() { open(current - 1); }
  function next() { open(current + 1); }

  // Attach click to each gallery item
  items.forEach((img, idx) => {
    const item = img.closest('.gallery__item');
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View photo ${idx + 1}`);
    item.addEventListener('click', () => open(idx));
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(idx); } });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  // Click backdrop to close
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  });
})();


/* ─── RSVP FORM ─── */
(function initRsvpForm() {
  const form      = document.getElementById('rsvpForm');
  const success   = document.getElementById('rsvpSuccess');
  const attendance = document.getElementById('attendance');
  const guestField = document.getElementById('guestField');

  // Show/hide guest count based on attendance
  attendance.addEventListener('change', () => {
    guestField.style.display = attendance.value === 'no' ? 'none' : '';
  });

  function validate() {
    let ok = true;

    const required = form.querySelectorAll('[required]');
    required.forEach(field => {
      const wrap = field.closest('.form__field');
      const err  = wrap.querySelector('.form__error');
      if (!field.value.trim()) {
        wrap.classList.add('error');
        if (err) err.textContent = 'This field is required.';
        ok = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        wrap.classList.add('error');
        if (err) err.textContent = 'Please enter a valid email address.';
        ok = false;
      } else {
        wrap.classList.remove('error');
        if (err) err.textContent = '';
      }
    });

    return ok;
  }

  // Remove error state on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form__field')?.classList.remove('error');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Collect data (replace this block with real backend/Formspree/etc.)
    const data = Object.fromEntries(new FormData(form));
    console.log('RSVP submitted:', data);

    // Simulate async submission
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.querySelectorAll('.form__row, .form__field, .form__submit').forEach(el => {
        el.style.display = 'none';
      });
      success.hidden = false;
    }, 1200);
  });
})();


/* ─── SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── PARALLAX: subtle hero bg movement ─── */
(function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
  }, { passive: true });
})();
