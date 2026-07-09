/* ─── MOTION & INTERACTION LAYER ───
   Ambient + scroll-triggered effects layered on top of the existing
   .fade-in system in script.js. Everything here no-ops under
   prefers-reduced-motion, and elements that don't exist are skipped. */

const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Scroll progress bar ─── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function update() {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    bar.style.width = (scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0) + '%';
  }
  addEventListener('scroll', update, { passive: true });
  update();
})();


/* ─── Ambient falling petals ─── */
(function initPetals() {
  if (REDUCED_MOTION) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'petalCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  addEventListener('resize', resize);

  const COLORS = ['rgba(201,169,110,0.5)', 'rgba(232,213,176,0.55)', 'rgba(247,181,193,0.4)'];
  function spawn(anyY) {
    return {
      x: Math.random() * W,
      y: anyY ? Math.random() * H : -20,
      r: 4 + Math.random() * 5,
      vy: 0.3 + Math.random() * 0.5,
      vx: -0.2 + Math.random() * 0.4,
      rot: Math.random() * Math.PI * 2,
      vr: -0.012 + Math.random() * 0.024,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      sway: Math.random() * Math.PI * 2,
    };
  }
  const petals = Array.from({ length: 16 }, () => spawn(true));

  function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    ctx.clearRect(0, 0, W, H);
    petals.forEach((p, i) => {
      p.sway += 0.012;
      p.x += p.vx + Math.sin(p.sway) * 0.3;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H + 24 || p.x < -30 || p.x > W + 30) petals[i] = spawn(false);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
  loop();
})();


/* ─── Butterfly ornament ─── */
(function initButterfly() {
  if (REDUCED_MOTION) return;
  const wrap = document.createElement('div');
  wrap.className = 'butterfly';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = `
    <svg width="34" height="26" viewBox="0 0 34 26">
      <ellipse cx="11" cy="9" rx="9" ry="7" fill="#C9A96E" opacity="0.85" transform="rotate(-18 11 9)"/>
      <ellipse cx="23" cy="9" rx="9" ry="7" fill="#E8D5B0" opacity="0.9" transform="rotate(18 23 9)"/>
      <ellipse cx="12" cy="18" rx="6" ry="4.5" fill="#E8D5B0" opacity="0.85" transform="rotate(-30 12 18)"/>
      <ellipse cx="22" cy="18" rx="6" ry="4.5" fill="#C9A96E" opacity="0.8" transform="rotate(30 22 18)"/>
      <rect x="16" y="4" width="2.2" height="18" rx="1.1" fill="#3A2E2A"/>
    </svg>`;
  document.body.appendChild(wrap);
})();


/* ─── Tap-to-bloom hearts (skip interactive elements) ─── */
(function initTapHearts() {
  if (REDUCED_MOTION) return;
  const EMOJI = ['💛', '🤍', '✨'];
  document.addEventListener('click', e => {
    if (e.target.closest('button, input, a, textarea, select, label, [role="button"]')) return;
    const heart = document.createElement('span');
    heart.className = 'tap-heart';
    heart.textContent = EMOJI[Math.floor(Math.random() * EMOJI.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  });
})();


/* ─── Portrait photo 3D tilt ─── */
(function initPortraitTilt() {
  if (REDUCED_MOTION) return;
  document.querySelectorAll('.portrait-feature__main').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 8}deg) scale(1.015)`;
    });
    card.addEventListener('pointerleave', () => { img.style.transform = ''; });
  });
})();


/* ─── Hero background parallax ─── */
(function initHeroParallax() {
  if (REDUCED_MOTION) return;
  const bg = document.querySelector('.hero__bg');
  if (!bg) return;
  function onScroll() {
    const y = scrollY;
    if (y < innerHeight * 1.3) bg.style.translate = `0 ${y * 0.22}px`;
  }
  addEventListener('scroll', onScroll, { passive: true });
})();


/* ─── Quote: word-by-word reveal on scroll ─── */
(function initQuoteReveal() {
  const q = document.querySelector('.quote-section__text p');
  if (!q) return;
  const words = q.textContent.trim().split(/\s+/);
  q.textContent = '';
  words.forEach((w, i) => {
    const span = document.createElement('span');
    span.textContent = w + ' ';
    span.style.opacity = '0.08';
    span.style.transition = 'opacity 0.5s ease';
    span.style.transitionDelay = (i * 45) + 'ms';
    q.appendChild(span);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      q.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  io.observe(q);
})();


/* ─── RSVP celebration burst — called from script.js on a successful,
   attending submission via the optional window.__celebrateRsvp hook ─── */
window.__celebrateRsvp = function (originEl) {
  if (REDUCED_MOTION) return;
  const target = originEl || document.querySelector('.rsvp__success-inner img');
  if (!target) return;
  const r = target.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const COLORS = ['#C9A96E', '#E8D5B0', '#F7B5C1', '#fff'];
  for (let i = 0; i < 34; i++) {
    const bit = document.createElement('span');
    bit.className = 'celebrate-bit';
    bit.style.left = cx + 'px';
    bit.style.top = cy + 'px';
    bit.style.background = COLORS[i % COLORS.length];
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 130;
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 60;
    bit.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy + 120}px) rotate(${Math.random() * 540 - 270}deg)`, opacity: 0 }
    ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' });
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 1700);
  }
};
