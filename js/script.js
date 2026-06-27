/* ═══════════════════════════════════════════
   JEI & ANGIE — Wedding Website JS
   ═══════════════════════════════════════════ */

/* ─── CONFIG ─── */
const APPS_SCRIPT_URL = localStorage.getItem('wb_script_url') || 'https://script.google.com/macros/s/AKfycby65CGQgJ0ox4BHohASwQoKrP93bhiZJvsYqkUo_28qKWj3Fi28UszslHUYuJVN4GLo3w/exec';
const SHEET_ID        = localStorage.getItem('wb_sheet_id')   || '1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o';


/* ─── I18N ─── */
const _I18N = {
  en: {
    'splash.label': 'The Wedding of',
    'splash.dear':  'Dear',
    'splash.btn':   'Open Invitation',

    'hero.subtitle': "By the grace of God, We're tying the knot.",
    'hero.invite':   'joyfully invite you to celebrate their wedding',

    'std.label': 'Save the Date',

    'cd.days': 'Days', 'cd.hours': 'Hours', 'cd.minutes': 'Minutes', 'cd.seconds': 'Seconds',

    'portraits.label': 'Meet the Couple',
    'portraits.title': 'The Bride & Groom',
    'groom.role':  'The Groom',
    'bride.role':  'The Bride',
    'groom.parents': 'Son of dr. Jose M. Mandei, Sp.A, Subsp.ETIA(K).<br />&amp; dr. Linda A. Matali, Sp.KKLP., M.Kes.',
    'bride.parents': 'Daughter of Noldy R. Kumendong, S.Hut.<br />&amp; Ir. Shirly S. Lengkong',

    'quote.text': 'I have found the one whom my soul loves.',
    'quote.cite': 'Song of Solomon 3:4',

    'details.label':  'Join Us',
    'details.title':  'Wedding Details',
    'ceremony.label': 'Holy Matrimony',
    'reception.label':'The Reception',
    'map.btn':        'View Map',

    'video.label': 'Our Story',
    'video.title': 'Before The Vow',

    'gallery.label': 'Captured Moments',
    'gallery.title': 'Our Gallery',

    'rsvp.label': 'Kindly Reply By 23 July 2026',
    'rsvp.title': 'RSVP',
    'rsvp.intro': 'It would be a great happiness for us if you would be willing to attend this joyful day. Thank you for all the kind words, prayers, and attention you have given. See you on our wedding day!',
    'rsvp.label.nowish': 'Share the Joy',
    'rsvp.title.nowish': 'Send Message and Wishes',
    'rsvp.intro.nowish': "We'd be so grateful to hear from you. Leave your heartfelt message and warm wishes for Jei & Angie below — they mean the world to us.",

    'form.name':           'Guest Name',
    'form.name.ph':        'Your full name',
    'form.attendance':     'Will you be attending?',
    'form.attendance.ph':  'Please select',
    'form.attendance.yes': 'Joyfully Accepts',
    'form.attendance.no':  'Congrats on your wedding day! (Cannot attend)',
    'form.guests':   'Number of Guests (Including Yourself)',
    'form.guests.1': '1 person',
    'form.guests.2': '2 persons',
    'form.message':    'Leave a Message & Wishes for Jei & Angie',
    'form.message.ph': 'Share your wishes with the couple…',
    'form.submit':       'Send My RSVP',
    'form.submit.nowish':'Send Wishes',
    'form.checking': 'Checking…',
    'form.sending':  'Sending…',

    'qr.label': 'Your Invitation',
    'qr.title': 'Your Entrance Pass',
    'qr.sub':   'Present this at the entrance on your wedding day',
    'qr.save':  'Save to Phone',

    'gift.btn': '💝 Send them a gift',

    'wishes.label':   'Kind Words',
    'wishes.title':   'Messages & Wishes',
    'wishes.loading': 'Loading messages…',
    'wishes.empty':   'Be the first to leave a message!',
    'wishes.soon':    'Messages coming soon…',

    'footer.quote':  '"To God Be The Glory Forever"',
    'footer.credit': 'Made with love ♥ by jeimandei',

    'gift.modal.title': 'Thank you for your generosity',
    'gift.modal.scan':  'Scan QRIS',
    'gift.modal.sub':   'with any m-banking or e-wallet app',

    'nav.meet': 'Meet the Couple', 'nav.details': 'Details', 'nav.gallery': 'Gallery', 'nav.rsvp': 'RSVP',

    'success.already.title':    "You've already RSVP'd, {name}!",
    'success.already.yes':      "We already have you down as attending. See you at the wedding!",
    'success.already.no':       "We already have your regrets on record. Thank you for letting us know.",
    'success.unlisted.title':   'Thank you for your wishes, {name}! 🌸',
    'success.unlisted.sub':     'Your kind words mean the world to us.',
    'success.listed.yes.title': "You're on the list, {name}!",
    'success.listed.yes.sub':   "We can't wait to celebrate with you.",
    'success.listed.no.title':  "So sad you can't make it 😢",
    'success.listed.no.sub':    "We really wished you could be there with us. But thank you for letting us know.",
  },

  id: {
    'splash.label': 'Pernikahan',
    'splash.dear':  'Kepada Yth.',
    'splash.btn':   'Buka Undangan',

    'hero.subtitle': 'Dengan anugerah Tuhan, kami akan menikah.',
    'hero.invite':   'dengan sukacita mengundang Anda merayakan hari pernikahan kami',

    'std.label': 'Simpan Tanggalnya',

    'cd.days': 'Hari', 'cd.hours': 'Jam', 'cd.minutes': 'Menit', 'cd.seconds': 'Detik',

    'portraits.label': 'Kenali Pasangan',
    'portraits.title': 'Mempelai',
    'groom.role':  'Mempelai Pria',
    'bride.role':  'Mempelai Wanita',
    'groom.parents': 'Putra dari dr. Jose M. Mandei, Sp.A, Subsp.ETIA(K).<br />&amp; dr. Linda A. Matali, Sp.KKLP., M.Kes.',
    'bride.parents': 'Putri dari Noldy R. Kumendong, S.Hut.<br />&amp; Ir. Shirly S. Lengkong',

    'quote.text': 'Aku telah menemukan dia yang dicintai jiwaku.',
    'quote.cite': 'Kidung Agung 3:4',

    'details.label':   'Bergabunglah Bersama Kami',
    'details.title':   'Detail Pernikahan',
    'ceremony.label':  'Pemberkatan',
    'reception.label': 'Resepsi',
    'map.btn':         'Lihat Peta',

    'video.label': 'Kisah Kami',
    'video.title': 'Sebelum Hari Itu',

    'gallery.label': 'Momen Berharga',
    'gallery.title': 'Galeri Kami',

    'rsvp.label': 'Harap Konfirmasi Sebelum 23 Juli 2026',
    'rsvp.title': 'RSVP',
    'rsvp.intro': 'Kami akan sangat berbahagia apabila Anda berkenan hadir dalam hari istimewa kami. Terima kasih atas doa, kata-kata baik, dan perhatian yang telah Anda berikan. Sampai jumpa di hari pernikahan kami!',
    'rsvp.label.nowish': 'Bagikan Sukacita',
    'rsvp.title.nowish': 'Kirim Pesan & Doa',
    'rsvp.intro.nowish': 'Kami sangat berterima kasih atas pesan Anda. Tinggalkan pesan dan doa tulus untuk Jei & Angie di bawah ini — setiap kata sangat berarti bagi kami.',

    'form.name':           'Nama Tamu',
    'form.name.ph':        'Nama lengkap Anda',
    'form.attendance':     'Apakah Anda akan hadir?',
    'form.attendance.ph':  'Pilih konfirmasi',
    'form.attendance.yes': 'Dengan Sukacita Hadir',
    'form.attendance.no':  'Selamat atas pernikahannya! (Tidak dapat hadir)',
    'form.guests':   'Jumlah Tamu (Termasuk Anda)',
    'form.guests.1': '1 orang',
    'form.guests.2': '2 orang',
    'form.message':    'Tinggalkan Pesan & Doa untuk Jei & Angie',
    'form.message.ph': 'Bagikan doa Anda untuk pasangan…',
    'form.submit':       'Kirim RSVP Saya',
    'form.submit.nowish':'Kirim Pesan',
    'form.checking': 'Memeriksa…',
    'form.sending':  'Mengirim…',

    'qr.label': 'Undangan Anda',
    'qr.title': 'Tiket Masuk Anda',
    'qr.sub':   'Tunjukkan ini di pintu masuk pada hari pernikahan',
    'qr.save':  'Simpan ke Ponsel',

    'gift.btn': '💝 Kirimkan hadiah',

    'wishes.label':   'Kata-Kata Indah',
    'wishes.title':   'Pesan & Doa',
    'wishes.loading': 'Memuat pesan…',
    'wishes.empty':   'Jadilah yang pertama meninggalkan pesan!',
    'wishes.soon':    'Pesan akan segera hadir…',

    'footer.quote':  '"Bagi Allah Segala Kemuliaan Selamanya"',
    'footer.credit': 'Dibuat dengan cinta ♥ oleh jeimandei',

    'gift.modal.title': 'Terima kasih atas kemurahan hati Anda',
    'gift.modal.scan':  'Scan QRIS',
    'gift.modal.sub':   'dengan m-banking atau e-wallet apapun',

    'nav.meet': 'Kenali Pasangan', 'nav.details': 'Detail', 'nav.gallery': 'Galeri', 'nav.rsvp': 'RSVP',

    'success.already.title':    'Anda sudah RSVP, {name}!',
    'success.already.yes':      'Kami sudah mencatat kehadiran Anda. Sampai jumpa di pernikahan!',
    'success.already.no':       'Kami sudah mencatat ketidakhadiran Anda. Terima kasih telah memberi tahu kami.',
    'success.unlisted.title':   'Terima kasih atas doa Anda, {name}! 🌸',
    'success.unlisted.sub':     'Kata-kata baik Anda sangat berarti bagi kami.',
    'success.listed.yes.title': 'Anda ada dalam daftar, {name}!',
    'success.listed.yes.sub':   'Kami tidak sabar merayakannya bersama Anda.',
    'success.listed.no.title':  'Sayang sekali Anda tidak bisa hadir 😢',
    'success.listed.no.sub':    'Kami sangat berharap Anda bisa hadir. Namun terima kasih telah memberi tahu kami.',
  },
};

let _lang = localStorage.getItem('wb_lang') || 'en';

function t(key) { return _I18N[_lang][key] || _I18N.en[key] || key; }

function setLang(lang) {
  _lang = lang;
  localStorage.setItem('wb_lang', lang);

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  const toParam = new URLSearchParams(window.location.search).get('to');
  if (!toParam) {
    const label = document.getElementById('rsvpLabel');
    const title = document.getElementById('rsvpTitle');
    const intro = document.getElementById('rsvpIntro');
    const submitBtn = document.querySelector('#rsvpForm button[type="submit"]');
    if (label) label.textContent = t('rsvp.label.nowish');
    if (title) title.textContent = t('rsvp.title.nowish');
    if (intro) intro.textContent = t('rsvp.intro.nowish');
    if (submitBtn) submitBtn.textContent = t('form.submit.nowish');
  }

}

// Apply on load
setLang(_lang);

/* ─── BACKGROUND MUSIC ─── */
(function initMusic() {
  var audio       = document.getElementById('bgAudio');
  var musicBtn    = document.getElementById('musicBtn');
  var musicPlayer = document.getElementById('musicPlayer');
  var closeBtn    = document.getElementById('musicPlayerClose');
  var playBtn     = document.getElementById('musicPlayBtn');
  var muteBtn     = document.getElementById('musicMuteBtn');

  musicPlayer.classList.add('is-hidden');

  window.__musicStart = function () {
    musicBtn.hidden = false;
    audio.play().catch(function () {});
    playBtn.classList.add('is-playing');
    playBtn.setAttribute('aria-label', 'Pause');
  };

  // Toggle player open / close
  musicBtn.addEventListener('click', function () {
    var nowHidden = musicPlayer.classList.toggle('is-hidden');
    musicBtn.setAttribute('aria-label', nowHidden ? 'Open music player' : 'Close music player');
  });

  closeBtn.addEventListener('click', function () {
    musicPlayer.classList.add('is-hidden');
    musicBtn.setAttribute('aria-label', 'Open music player');
  });

  // Click outside to close
  document.addEventListener('click', function (e) {
    if (!musicPlayer.classList.contains('is-hidden') &&
        !musicPlayer.contains(e.target) &&
        !musicBtn.contains(e.target)) {
      musicPlayer.classList.add('is-hidden');
      musicBtn.setAttribute('aria-label', 'Open music player');
    }
  });

  // Play / Pause
  playBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () {});
      playBtn.classList.add('is-playing');
      playBtn.setAttribute('aria-label', 'Pause');
    } else {
      audio.pause();
      playBtn.classList.remove('is-playing');
      playBtn.setAttribute('aria-label', 'Play');
    }
  });

  // Mute / Unmute
  muteBtn.addEventListener('click', function () {
    audio.muted = !audio.muted;
    muteBtn.classList.toggle('is-muted', audio.muted);
    muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute' : 'Mute');
  });
})();


/* ─── SPLASH PAGE ─── */
(function initSplash() {
  const splash   = document.getElementById('splash');
  const guestEl  = document.getElementById('splashGuest');
  const btn      = document.getElementById('splashBtn');

  const toParam = new URLSearchParams(window.location.search).get('to');
  if (toParam) {
    if (!/^[0-9a-f]{16}$/.test(toParam)) {
      // Legacy name-based link
      guestEl.textContent = toParam;
      const nameField = document.getElementById('guestName');
      if (nameField) { nameField.value = toParam; nameField.readOnly = true; }
    } else {
      // ID-based link — resolve name from Guests sheet
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Guests&_=${Date.now()}`)
        .then(r => r.text())
        .then(text => {
          const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
          if (!m) return;
          const row = (JSON.parse(m[1]).table?.rows || []).find(r => r.c?.[0]?.v === toParam);
          if (!row) return;
          const name = String(row.c?.[1]?.v || '').trim();
          guestEl.textContent = name;
          const nameField = document.getElementById('guestName');
          if (nameField) { nameField.value = name; nameField.readOnly = true; }
        }).catch(() => {});
    }
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


/* ─── HERO PHOTO LIGHTBOX ─── */
(function initHeroLightbox() {
  const heroPhoto = document.getElementById('heroPhoto');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const btnClose  = lightbox.querySelector('.lightbox__close');
  const btnPrev   = lightbox.querySelector('.lightbox__prev');
  const btnNext   = lightbox.querySelector('.lightbox__next');

  function openHero() {
    lbImg.src = heroPhoto.src;
    lbImg.alt = heroPhoto.alt;
    lightbox.hidden = false;
    lightbox.dataset.mode = 'single';
    btnPrev.hidden = true;
    btnNext.hidden = true;
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeHero() {
    lightbox.hidden = true;
    delete lightbox.dataset.mode;
    btnPrev.hidden = false;
    btnNext.hidden = false;
    document.body.style.overflow = '';
  }

  heroPhoto.addEventListener('click', openHero);
  heroPhoto.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHero(); } });

  btnClose.addEventListener('click', () => { if (lightbox.dataset.mode === 'single') closeHero(); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox && lightbox.dataset.mode === 'single') closeHero(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.dataset.mode === 'single') closeHero(); });
})();


/* ─── QRIS ZOOM LIGHTBOX ─── */
(function initQrisZoom() {
  const btn     = document.getElementById('qrisZoomBtn');
  if (!btn) return;
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev  = lightbox.querySelector('.lightbox__prev');
  const btnNext  = lightbox.querySelector('.lightbox__next');

  function openQris() {
    lbImg.src = 'images/assets/qris.png';
    lbImg.alt = 'QRIS Payment Code';
    lightbox.hidden = false;
    lightbox.dataset.mode = 'qris';
    btnPrev.hidden = true;
    btnNext.hidden = true;
  }

  function closeQris() {
    lightbox.hidden = true;
    delete lightbox.dataset.mode;
    btnPrev.hidden = false;
    btnNext.hidden = false;
  }

  btn.addEventListener('click', openQris);
  btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQris(); } });
  btnClose.addEventListener('click', () => { if (lightbox.dataset.mode === 'qris') closeQris(); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox && lightbox.dataset.mode === 'qris') closeQris(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.dataset.mode === 'qris') closeQris(); });
})();


/* ─── GALLERY LIGHTBOX ─── */
function setupLightbox(carousel, images) {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev  = lightbox.querySelector('.lightbox__prev');
  const btnNext  = lightbox.querySelector('.lightbox__next');

  let current = 0;

  function open(idx) {
    current = ((idx % images.length) + images.length) % images.length;
    lbImg.src = images[current];
    lbImg.alt = 'Jei and Angie';
    lightbox.hidden = false;
    lightbox.dataset.mode = 'gallery';
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    delete lightbox.dataset.mode;
    document.body.style.overflow = '';
  }

  function prev() { open(current - 1); }
  function next() { open(current + 1); }

  carousel.querySelectorAll('.gallery__item').forEach(item => {
    const idx = parseInt(item.dataset.idx, 10);
    const isDupe = item.getAttribute('aria-hidden') === 'true';
    item.setAttribute('tabindex', isDupe ? '-1' : '0');
    item.setAttribute('role', 'button');
    if (!isDupe) item.setAttribute('aria-label', `View photo ${idx + 1}`);
    item.addEventListener('click', () => open(idx));
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(idx); } });
  });

  btnClose.addEventListener('click', () => { if (lightbox.dataset.mode === 'gallery') close(); });
  btnPrev.addEventListener('click',  () => { if (lightbox.dataset.mode === 'gallery') prev(); });
  btnNext.addEventListener('click',  () => { if (lightbox.dataset.mode === 'gallery') next(); });

  lightbox.addEventListener('click', e => { if (e.target === lightbox && lightbox.dataset.mode === 'gallery') close(); });

  document.addEventListener('keydown', e => {
    if (lightbox.hidden || lightbox.dataset.mode !== 'gallery') return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (lightbox.dataset.mode !== 'gallery') return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  });
}

(function initGallery() {
  const track1   = document.getElementById('galleryTrack1');
  const track2   = document.getElementById('galleryTrack2');
  const carousel = document.getElementById('galleryCarousel');

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildTrack(trackEl, items, startIdx) {
    const html = [];
    items.forEach((src, i) => {
      const idx = startIdx + i;
      html.push(`<div class="gallery__item" data-idx="${idx}"><img src="${src}" alt="Jei and Angie" loading="lazy" /></div>`);
    });
    items.forEach((src, i) => {
      const idx = startIdx + i;
      html.push(`<div class="gallery__item" data-idx="${idx}" aria-hidden="true"><img src="${src}" alt="" loading="lazy" /></div>`);
    });
    trackEl.innerHTML = html.join('');
  }

  fetch('images/manifest.json')
    .then(r => r.json())
    .then(all => {
      const images = shuffle(all.slice());
      const half   = Math.ceil(images.length / 2);
      buildTrack(track1, images.slice(0, half), 0);
      buildTrack(track2, images.slice(half),    half);
      setupLightbox(carousel, images);
    })
    .catch(() => {});
})();


/* ─── QR PASS ─── */
(function initQR() {
  const SALT    = 'ShadowRubyAsh120122';
  const toParam = new URLSearchParams(window.location.search).get('to');
  if (!toParam) return;

  const isId = /^[0-9a-f]{16}$/.test(toParam);

  async function guestId(n) {
    const normalized = n.trim().toLowerCase();
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized + SALT));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }

  function buildQR(el, url, size) {
    return new QRCode(el, {
      text: url,
      width: size,
      height: size,
      colorDark: '#3D2B1F',
      colorLight: '#FDF6EE',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  function saveQR(wrapEl, filename) {
    const el = wrapEl.querySelector('canvas') || wrapEl.querySelector('img');
    if (!el) return;
    const a = document.createElement('a');
    a.download = filename;
    a.href = el.tagName === 'CANVAS' ? el.toDataURL('image/png') : el.src;
    a.click();
  }

  function showQR(name, qrUrl) {
    const qrSection = document.getElementById('qr');
    const qrCanvas  = document.getElementById('qrCanvas');
    if (qrSection && qrCanvas) {
      qrSection.hidden = false;
      document.getElementById('qrGuestName').textContent = name;
      qrCanvas.innerHTML = '';
      buildQR(qrCanvas, qrUrl, 200);
      document.getElementById('qrSave').addEventListener('click', () =>
        saveQR(qrCanvas, `entrance-pass-${name.replace(/\s+/g, '-')}.png`)
      );
    }
    window.__guestQR = { name, url: qrUrl, saveQR, buildQR };
  }

  if (isId) {
    // ID-based link: verify ID in Guests sheet, use current page URL as the unified QR
    fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Guests&_=${Date.now()}`)
      .then(r => r.text())
      .then(text => {
        const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
        if (!m) return;
        const rows = JSON.parse(m[1]).table?.rows || [];
        const row  = rows.find(r => r.c?.[0]?.v === toParam);
        if (!row) return;
        showQR(String(row.c?.[1]?.v || '').trim(), location.href);
      })
      .catch(() => {});
  } else {
    // Legacy name-based link: hash the name, verify by name column, QR → welcome.html?id=HASH
    guestId(toParam).then(async id => {
      const qrUrl = `${location.origin}/welcome.html?id=${id}`;
      try {
        const text = await fetch(
          `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Guests&_=${Date.now()}`
        ).then(r => r.text());
        const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
        if (!m) return;
        const rows       = JSON.parse(m[1]).table?.rows || [];
        const normalized = toParam.trim().toLowerCase();
        if (!rows.some(r => String(r.c?.[1]?.v || '').trim().toLowerCase() === normalized)) return;
      } catch (_) { return; }
      showQR(toParam, qrUrl);
    });
  }
})();


/* ─── GIFT MODAL ─── */
(function initGiftModal() {
  const modal    = document.getElementById('giftModal');
  const closeBtn = document.getElementById('giftModalClose');
  const backdrop = modal.querySelector('.gift-modal__backdrop');

  function open()  { modal.hidden = false; document.body.style.overflow = 'hidden'; closeBtn.focus(); }
  function close() { modal.hidden = true;  document.body.style.overflow = ''; }

  document.querySelectorAll('.js-gift-open').forEach(btn => btn.addEventListener('click', open));
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });

  window.__closeGiftModal = close;

  /* ── Transfer panel toggle ── */
  document.getElementById('transferToggle').addEventListener('click', function() {
    var panel = document.getElementById('transferPanel');
    var expanded = this.getAttribute('aria-expanded') === 'true';
    panel.hidden = expanded;
    this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });

  /* ── Account rows: tap to reveal/hide ── */
  document.querySelectorAll('.gift-modal__account').forEach(function(row) {
    row.addEventListener('click', function(e) {
      if (e.target.closest('.gift-modal__copy')) return; // let copy handle itself
      var revealed = row.classList.toggle('is-revealed');
      row.setAttribute('aria-expanded', revealed ? 'true' : 'false');
    });
    row.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
    });
  });

  /* ── Copy icon buttons ── */
  document.querySelectorAll('.gift-modal__copy').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var text = btn.closest('.gift-modal__account').dataset.copy;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .catch(function() {
          var ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta);
        })
        .finally(function() {
          btn.classList.add('copied');
          setTimeout(function() { btn.classList.remove('copied'); }, 1800);
        });
    });
  });
})();


/* ─── RSVP FORM ─── */
(function initRsvpForm() {
  const form       = document.getElementById('rsvpForm');
  const success    = document.getElementById('rsvpSuccess');
  const attendance = document.getElementById('attendance');
  const guestField = document.getElementById('guestField');

  // If no personalized invite link, hide attendance + persons fields.
  // Header copy is handled by setLang() which already ran.
  const toParam = new URLSearchParams(window.location.search).get('to');
  if (!toParam) {
    const attendanceRow = form.querySelector('.form__row');
    if (attendanceRow) attendanceRow.style.display = 'none';
    attendance.removeAttribute('required');
  }

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

  async function fetchRsvpRows() {
    const text = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=RSVP&_=${Date.now()}`
    ).then(r => r.text());
    const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
    if (!m) return [];
    return JSON.parse(m[1]).table?.rows || [];
  }

  function showAlreadySubmitted(name, prevAttendance) {
    form.querySelectorAll('.form__row, .form__field, .form__submit').forEach(el => {
      el.style.display = 'none';
    });
    const isAttending = String(prevAttendance).toLowerCase() === 'yes';
    document.getElementById('rsvpSuccessTitle').textContent =
      t('success.already.title').replace('{name}', name);
    document.getElementById('rsvpSuccessSub').textContent = isAttending
      ? t('success.already.yes')
      : t('success.already.no');
    success.hidden = false;
  }

  // If name is pre-filled from ?to= param, check for prior submission on load
  const nameField = document.getElementById('guestName');
  if (nameField && nameField.readOnly && nameField.value.trim()) {
    const prefilledName = nameField.value.trim();
    fetchRsvpRows().then(rows => {
      const normalized = prefilledName.toLowerCase();
      const match = [...rows].reverse().find(r =>
        String(r.c?.[1]?.v || '').trim().toLowerCase() === normalized
      );
      if (match) showAlreadySubmitted(prefilledName, match.c?.[2]?.v || '');
    }).catch(() => {});
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    const data = Object.fromEntries(new FormData(form));
    const btn  = form.querySelector('button[type="submit"]');
    btn.textContent = t('form.checking');
    btn.disabled = true;

    let isListed = false;

    // Check if already submitted and whether guest is on the list (parallel fetches)
    try {
      const [rsvpRows, guestText] = await Promise.all([
        fetchRsvpRows(),
        fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Guests&_=${Date.now()}`).then(r => r.text())
      ]);
      const normalized = String(data.guestName || '').trim().toLowerCase();

      const match = [...rsvpRows].reverse().find(r =>
        String(r.c?.[1]?.v || '').trim().toLowerCase() === normalized
      );
      if (match) {
        showAlreadySubmitted(data.guestName, match.c?.[2]?.v || '');
        return;
      }

      const gm = guestText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
      if (gm) {
        const guestRows = JSON.parse(gm[1]).table?.rows || [];
        isListed = guestRows.some(r => String(r.c?.[1]?.v || '').trim().toLowerCase() === normalized);
      }
    } catch (_) {} // On error: proceed with submission, treat as unlisted

    btn.textContent = t('form.sending');

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

    const isAttending = data.attendance === 'yes';
    const guestName   = data.guestName || '';
    if (!isListed) {
      document.getElementById('rsvpSuccessTitle').textContent = t('success.unlisted.title').replace('{name}', guestName);
      document.getElementById('rsvpSuccessSub').textContent   = t('success.unlisted.sub');
    } else {
      document.getElementById('rsvpSuccessTitle').textContent = isAttending
        ? t('success.listed.yes.title').replace('{name}', guestName)
        : t('success.listed.no.title');
      document.getElementById('rsvpSuccessSub').textContent = isAttending
        ? t('success.listed.yes.sub')
        : t('success.listed.no.sub');
    }

    success.hidden = false;

    if (typeof window.__loadWishes === 'function') window.__loadWishes();

    // Attending + QR visible → scroll to entrance pass
    // Attending + no QR (no ?to= param) → stay on success message
    // Not attending → scroll to wishes
    setTimeout(function () {
      const qrSection = document.getElementById('qr');
      const target = isAttending
        ? (qrSection && !qrSection.hidden ? qrSection : null)
        : document.getElementById('wishes');
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 1500);

    // Refresh again once Apps Script has had time to write the row
    setTimeout(function () {
      if (typeof window.__loadWishes === 'function') window.__loadWishes();
    }, 3000);
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

  const modal       = document.getElementById('wishModal');
  const modalName   = document.getElementById('wishModalName');
  const modalMsg    = document.getElementById('wishModalMessage');
  const modalClose  = document.getElementById('wishModalClose');
  const backdrop    = modal.querySelector('.wish-modal__backdrop');

  function openWish(name, message) {
    modalName.textContent    = name;
    modalMsg.textContent     = message;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeWish() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeWish);
  backdrop.addEventListener('click', closeWish);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeWish(); });

  function esc(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str)));
    return d.innerHTML;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  function loadWishes() {
    fetch(url + '&_=' + Date.now())
      .then(r => r.text())
      .then(text => {
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
        if (!match) throw new Error('parse error');

        const json = JSON.parse(match[1]);
        const rows = json.table?.rows || [];

        const wishes = rows
          .map(row => ({
            name:    row.c?.[1]?.v || '',
            message: row.c?.[4]?.v || ''
          }))
          .filter(w => w.name && w.message);

        if (!wishes.length) {
          track.innerHTML = `<p class="wishes__empty">${t('wishes.empty')}</p>`;
          return;
        }

        track.innerHTML = wishes.map(w => `
          <div class="wish-card" role="button" tabindex="0"
               data-name="${esc(w.name)}" data-message="${esc(w.message)}"
               aria-label="Read wish from ${esc(w.name)}">
            <p class="wish-card__name">${esc(w.name)}</p>
            <p class="wish-card__message">"${esc(w.message)}"</p>
          </div>
        `).join('');

        track.querySelectorAll('.wish-card').forEach(card => {
          card.addEventListener('click', () => openWish(card.dataset.name, card.dataset.message));
          card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWish(card.dataset.name, card.dataset.message); } });
        });
      })
      .catch(() => {
        track.innerHTML = `<p class="wishes__empty">${t('wishes.soon')}</p>`;
      });
  }

  window.__loadWishes = loadWishes;
  loadWishes();
})();


/* ─── YOUTUBE PLAYER — music pause/resume ─── */
(function initVideoPlayer() {
  if (!document.getElementById('ytPlayer')) return;

  let _musicWasPlaying = false;

  window.onYouTubeIframeAPIReady = function () {
    new YT.Player('ytPlayer', {
      events: {
        onStateChange: function (e) {
          const audio = document.getElementById('bgAudio');
          if (!audio) return;

          if (e.data === YT.PlayerState.PLAYING) {
            _musicWasPlaying = !audio.paused;
            if (_musicWasPlaying) audio.pause();
          } else if (
            e.data === YT.PlayerState.PAUSED ||
            e.data === YT.PlayerState.ENDED
          ) {
            if (_musicWasPlaying) {
              audio.play().catch(function () {});
            }
          }
        }
      }
    });
  };
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
