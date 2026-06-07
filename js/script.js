/* ═══════════════════════════════════════════
   JEI & ANGIE — Wedding Website JS
   ═══════════════════════════════════════════ */

/* ─── CONFIG ─── */
// After deploying the Apps Script (see apps-script.js), paste the Web App URL here:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby65CGQgJ0ox4BHohASwQoKrP93bhiZJvsYqkUo_28qKWj3Fi28UszslHUYuJVN4GLo3w/exec';
const SHEET_ID = '1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o';

/* ─── BACKGROUND MUSIC ─── */
(function initMusic() {
  var audio    = document.getElementById('bgAudio');
  var musicBtn = document.getElementById('musicBtn');

  window.__musicStart = function () {
    musicBtn.hidden = false;
    audio.play().catch(function () {});
  };

  musicBtn.addEventListener('click', function () {
    audio.muted = !audio.muted;
    musicBtn.classList.toggle('is-muted', audio.muted);
    musicBtn.setAttribute('aria-label', audio.muted ? 'Unmute music' : 'Mute music');
  });
})();


/* ─── SPLASH PAGE ─── */
(function initSplash() {
  const splash   = document.getElementById('splash');
  const guestEl  = document.getElementById('splashGuest');
  const btn      = document.getElementById('splashBtn');

  const name = new URLSearchParams(window.location.search).get('to');
  if (name) {
    guestEl.textContent = name;
    const nameField = document.getElementById('guestName');
    if (nameField) nameField.value = name;
  }

  document.body.style.overflow = 'hidden';

  btn.addEventListener('click', function () {
    window.__musicStart();
    splash.classList.add('is-hidden');
    document.body.style.overflow = '';
    splash.addEventListener('transitionend', function () {
      splash.hidden = true;
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, { once: true });
  });
})();


/* ─── COUNTDOWN TIMER ─── */
(function initCountdown() {
  const target = new Date('2026-07-26T13:00:00+08:00').getTime();
  const els = {
    days:    document.getElementById('cdDays'),
    hours:   document.getElementById('cdHours'),
    minutes: document.getElementById('cdMinutes'),
    seconds: document.getElementById('cdSeconds'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (els.days)    els.days.textContent    = pad(d);
    if (els.hours)   els.hours.textContent   = pad(h);
    if (els.minutes) els.minutes.textContent = pad(m);
    if (els.seconds) els.seconds.textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();


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

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    const data = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    if (APPS_SCRIPT_URL && APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL') {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(data)
        });
      } catch (_) {}
    }

    form.querySelectorAll('.form__row, .form__field, .form__submit').forEach(el => {
      el.style.display = 'none';
    });
    success.hidden = false;
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


/* ─── MESSAGES & WISHES ─── */
(function initWishes() {
  const track = document.getElementById('wishesTrack');
  if (!track) return;

  function esc(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str)));
    return d.innerHTML;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  fetch(url)
    .then(r => r.text())
    .then(text => {
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
      if (!match) throw new Error('parse error');

      const json = JSON.parse(match[1]);
      const rows = json.table?.rows || [];

      // Columns: 0=Timestamp, 1=Guest Name, 2=Attendance, 3=Guests, 4=Message
      const wishes = rows
        .map(row => ({
          name:    row.c?.[1]?.v || '',
          message: row.c?.[4]?.v || ''
        }))
        .filter(w => w.name && w.message);

      if (!wishes.length) {
        track.innerHTML = '<p class="wishes__empty">Be the first to leave a message!</p>';
        return;
      }

      // Duplicate array for seamless infinite loop
      const doubled = [...wishes, ...wishes];
      track.innerHTML = doubled.map(w => `
        <div class="wish-card">
          <p class="wish-card__name">${esc(w.name)}</p>
          <p class="wish-card__message">"${esc(w.message)}"</p>
        </div>
      `).join('');

      // ~5s per card, clamped between 20s and 120s
      track.style.animationDuration = Math.min(Math.max(wishes.length * 5, 20), 120) + 's';
    })
    .catch(() => {
      track.innerHTML = '<p class="wishes__empty">Messages coming soon…</p>';
    });
})();


/* ─── PARALLAX: subtle hero bg movement ─── */
(function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
  }, { passive: true });
})();
