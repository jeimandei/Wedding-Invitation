/* ─── GIFT MODAL (shared between index.html and welcome.html) ───
   Requires APPS_SCRIPT_URL to be declared before this script runs, plus
   the qrcodejs and jsQR libraries loaded, and the #giftModal / #lightbox
   markup present in the page. */

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
    const currentImg = btn.querySelector('.gift-modal__qris');
    lbImg.src = currentImg ? currentImg.src : 'images/assets/qris.png';
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


/* ─── GIFT MODAL ─── */
(function initGiftModal() {
  const modal    = document.getElementById('giftModal');
  const closeBtn = document.getElementById('giftModalClose');
  const backdrop = modal.querySelector('.gift-modal__backdrop');

  function open() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    if (typeof window.__onGiftModalOpen === 'function') window.__onGiftModalOpen();
  }
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
      if (revealed) {
        var bankEl = row.querySelector('.gift-modal__bank');
        if (bankEl) window.__giftLastMethod = bankEl.textContent.trim();
      }
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


/* ─── DYNAMIC QRIS (guest-entered amount) ───
   Converts the static open-amount QRIS into an amount-embedded EMV QR by
   decoding the existing qris.png (via jsQR), rewriting tag 54 (amount) and
   tag 01 (point-of-initiation: 11 static / 12 dynamic), then recomputing
   the tag 63 CRC — same merchant account, no bank API involved. */
(function initDynamicQris() {
  const input        = document.getElementById('giftAmountInput');
  const clearBtn     = document.getElementById('giftAmountClear');
  const hint         = document.getElementById('giftAmountHint');
  const qrImg        = document.querySelector('.gift-modal__qris');
  const downloadLink = document.querySelector('.gift-modal__download');
  const renderTarget = document.getElementById('qrisDynamicRender');
  const chips        = document.querySelectorAll('.gift-modal__chip');
  if (!input || !qrImg || !renderTarget) return;

  const STATIC_SRC  = qrImg.getAttribute('src');
  const STATIC_NAME = downloadLink ? downloadLink.getAttribute('download') : 'Jei-Angie-QRIS.png';

  let baseQris       = null;
  let baseLoadFailed = false;
  let debounceTimer  = null;

  function crc16ccitt(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function parseEmvTlv(str) {
    const fields = [];
    let i = 0;
    while (i + 4 <= str.length) {
      const tag = str.substr(i, 2);
      const len = parseInt(str.substr(i + 2, 2), 10);
      if (isNaN(len)) break;
      fields.push({ tag, value: str.substr(i + 4, len) });
      i += 4 + len;
    }
    return fields;
  }

  function tlv(tag, value) {
    return tag + String(value.length).padStart(2, '0') + value;
  }

  function buildDynamicQris(baseStr, amount) {
    const fields = parseEmvTlv(baseStr.trim());
    if (!fields.length) throw new Error('QRIS parse failed');

    let out = '';
    let amountInserted = false;
    fields.forEach(f => {
      if (f.tag === '63' || f.tag === '54') return; // drop old CRC / amount, rebuilt below
      if (f.tag === '01') { out += tlv('01', amount ? '12' : '11'); return; }
      out += tlv(f.tag, f.value);
      if (f.tag === '53' && amount) { out += tlv('54', String(amount)); amountInserted = true; }
    });
    if (amount && !amountInserted) out += tlv('54', String(amount));

    out += '6304';
    return out + crc16ccitt(out);
  }

  function loadQrisBaseString() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width  = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = (typeof jsQR !== 'undefined') ? jsQR(data.data, data.width, data.height) : null;
          if (code && code.data) resolve(code.data); else reject(new Error('decode failed'));
        } catch (e) { reject(e); }
      };
      img.onerror = reject;
      img.src = STATIC_SRC;
    });
  }

  function ensureBaseLoaded() {
    if (baseQris || baseLoadFailed) return Promise.resolve(baseQris);
    return loadQrisBaseString()
      .then(str => { baseQris = str; return str; })
      .catch(() => {
        baseLoadFailed = true;
        input.disabled = true;
        chips.forEach(c => c.disabled = true);
        hint.textContent = '';
        return null;
      });
  }

  function fmtRupiah(n) { return 'Rp ' + n.toLocaleString('id-ID'); }

  function resetStatic() {
    qrImg.src = STATIC_SRC;
    if (downloadLink) {
      downloadLink.href = STATIC_SRC;
      downloadLink.setAttribute('download', STATIC_NAME);
    }
  }

  function renderDynamic(amount) {
    renderTarget.innerHTML = '';
    new QRCode(renderTarget, {
      text: buildDynamicQris(baseQris, amount),
      width: 253, height: 253,
      colorDark: '#3D2B1F', colorLight: '#FDF6EE',
      correctLevel: QRCode.CorrectLevel.M
    });
    const canvas = renderTarget.querySelector('canvas');
    if (!canvas) throw new Error('render failed');
    const dataUrl = canvas.toDataURL('image/png');
    qrImg.src = dataUrl;
    if (downloadLink) {
      downloadLink.href = dataUrl;
      downloadLink.setAttribute('download', `Jei-Angie-QRIS-Rp${amount}.png`);
    }
  }

  function applyAmount(amount) {
    if (!amount) {
      resetStatic();
      clearBtn.hidden = true;
      hint.textContent = 'Enter an amount to pre-fill it in your banking app (optional)';
      return;
    }
    ensureBaseLoaded().then(str => {
      if (!str) return; // decode failed — stay on static QRIS
      try {
        renderDynamic(amount);
        clearBtn.hidden = false;
        hint.textContent = `Amount set to ${fmtRupiah(amount)} — tap ✕ to clear`;
        window.__giftLastMethod = 'QRIS';
      } catch (e) {
        resetStatic();
      }
    });
  }

  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '');
    const amount = digits ? parseInt(digits, 10) : 0;
    input.value = digits ? Number(digits).toLocaleString('id-ID') : '';
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => applyAmount(amount), 350);
  });

  clearBtn.addEventListener('click', () => { input.value = ''; applyAmount(0); });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const amount = parseInt(chip.dataset.amount, 10);
      input.value = amount.toLocaleString('id-ID');
      applyAmount(amount);
    });
  });

  // Exposed so a shared device (e.g. the entrance check-in screen) can wipe
  // one guest's entered amount before the next guest's welcome screen shows.
  window.__resetGiftAmount = () => { input.value = ''; applyAmount(0); };
})();


/* ─── GIFT CONFIRMATION (guest self-reports amount sent) ─── */
(function initGiftConfirm() {
  const openBtn   = document.getElementById('giftConfirmBtn');
  const form      = document.getElementById('giftConfirmForm');
  const nameInput = document.getElementById('giftConfirmName');
  const amtInput  = document.getElementById('giftConfirmAmount');
  const methodSel = document.getElementById('giftConfirmMethod');
  const noteInput = document.getElementById('giftConfirmNote');
  const submitBtn = document.getElementById('giftConfirmSubmit');
  const thanks    = document.getElementById('giftConfirmThanks');
  if (!openBtn || !form) return;

  const STORAGE_KEY = 'wb_gift_confirmed';

  function storedConfirmation() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) { return null; }
  }

  function showThanks(record) {
    openBtn.hidden = true;
    form.hidden = true;
    thanks.hidden = false;
    thanks.textContent = `You told us about a gift of Rp ${Number(record.amount).toLocaleString('id-ID')} — thank you! 💛`;
  }

  const existing = storedConfirmation();
  if (existing) showThanks(existing);

  openBtn.addEventListener('click', () => {
    const guestNameField = document.getElementById('guestName');
    nameInput.value = (guestNameField && guestNameField.value.trim()) ||
                      (window.__guestQR && window.__guestQR.name) ||
                      window.__checkedInGuestName || '';

    const amountInput = document.getElementById('giftAmountInput');
    amtInput.value = (amountInput && amountInput.value) || '';

    const lastMethod = window.__giftLastMethod;
    methodSel.value = (lastMethod && Array.from(methodSel.options).some(o => o.value === lastMethod))
      ? lastMethod : 'QRIS';

    openBtn.hidden = true;
    form.hidden = false;
    nameInput.focus();
  });

  amtInput.addEventListener('input', () => {
    const digits = amtInput.value.replace(/\D/g, '');
    amtInput.value = digits ? Number(digits).toLocaleString('id-ID') : '';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name   = nameInput.value.trim();
    const amount = amtInput.value.replace(/\D/g, '');
    if (!name || !amount) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const finish = () => {
      const record = { name, amount, method: methodSel.value, note: noteInput.value.trim() };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch (_) {}
      showThanks(record);
    };

    // Race against a timeout so a stalled connection never leaves the guest
    // stuck on "Sending…" — this is a self-reported record either way.
    Promise.race([
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'gift',
          guestName: name,
          amount: amount,
          method: methodSel.value,
          note: noteInput.value.trim()
        })
      }).catch(() => {}),
      new Promise(resolve => setTimeout(resolve, 7000))
    ]).then(finish);
  });

  // Exposed so a shared device (e.g. the entrance check-in screen) can wipe
  // one guest's confirmation before the next guest's welcome screen shows —
  // localStorage is device-scoped, not guest-scoped, so without this every
  // guest after the first would see "already confirmed" on that device.
  window.__resetGiftConfirm = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    window.__giftLastMethod = null;
    openBtn.hidden = false;
    form.hidden = true;
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
    thanks.hidden = true;
  };
})();


/* ─── Combined reset hook for pages that show a fresh guest per view
   (currently welcome.html's entrance check-in screen) ─── */
window.__resetGiftModal = () => {
  if (typeof window.__resetGiftAmount === 'function') window.__resetGiftAmount();
  if (typeof window.__resetGiftConfirm === 'function') window.__resetGiftConfirm();
};
