# Jei & Angie — Wedding Invitation Website

A bespoke, Bridgerton-inspired romantic garden wedding invitation website.

---

## Project Structure

```
wedding-website/
├── index.html              # Main page (all sections)
├── css/
│   └── styles.css          # Full stylesheet with design tokens
├── js/
│   └── script.js           # Nav, lightbox, RSVP form, QR pass, parallax
├── images/
│   ├── groombride/         # Couple pre-wedding photos (compressed ≤350 KB each)
│   ├── solo/               # Solo bride & groom portraits
│   └── assets/             # Design assets: florals, backgrounds, icons, qris.png
├── audio/                  # Background music
├── fonts/                  # Self-hosted Blacksword OTF
├── Containerfile            # nginx:alpine container definition
└── README.md
```

---

## Design System

### Color Palette
| Name       | Hex       | Usage                          |
|------------|-----------|--------------------------------|
| Gold       | `#C9A96E` | Accents, borders, buttons      |
| Gold Light | `#E8D5B0` | Subtle highlights              |
| Ivory      | `#F5EEE6` | Section backgrounds            |
| Warm White | `#FBF7F4` | Page background                |
| Text Dark  | `#3A2E2A` | Headings, body copy            |
| Text Light | `#A0877C` | Muted labels, captions         |

### Typography
- **Headings:** Cormorant Garamond (300–600) — elegant serif
- **Script / Names:** Great Vibes — romantic cursive
- **Display / Couple names:** Blacksword (self-hosted OTF)
- **Body / Labels:** Montserrat (300–600) — clean sans-serif

---

## Sections

1. **Splash** — Fullscreen landing with guest name from `?to=` URL param
2. **Hero** — Couple photo, names, countdown timer, scroll cue
3. **Save the Date** — Date & location banner
4. **Quote** — Scripture verse (Song of Solomon 3:4) over full-bleed photo
5. **Wedding Details** — Ceremony & reception cards
6. **Dress Code** — Garden Formal palette guide
7. **Portraits** — Bride & groom solo portraits
8. **Gallery** — Dynamic infinite carousel (reads `images/manifest.json`, shuffled on load)
9. **RSVP** — Validated form → Google Sheets via Apps Script
10. **QR Entrance Pass** — Personal QR code (only shown when `?to=Name` is in URL)
11. **Messages & Wishes** — Grid of guest messages from Google Sheets, auto-refreshes after RSVP
12. **Footer** — Names, date, credit

---

## Guest QR Pass System

Each guest receives a personalized invitation link: `yoursite.com/?to=GuestName`

### How It Works
- The guest's name is hashed client-side with SHA-256 + a private salt
- The hash produces a deterministic 16-char ID — **same QR every visit, any device**
- QR encodes `yoursite.com/welcome.html?id=<hash>` for entrance scanning
- The QR section is hidden if no `?to=` param is present

### After RSVP Submission
- **Attending guests** — see a personal entrance QR card + "Save to Phone" button
- **Non-attending guests** — see a warm thank-you message (no entrance QR)
- **All guests** — see a discreet "💝 Send a gift" button that opens the QRIS modal

### QRIS Gift Modal
- Hidden behind a subtle text button — tasteful, not pushy
- Shows the couple's QRIS code (`images/assets/qris.png`)
- Compatible with GoPay, OVO, Dana, ShopeePay, BCA, BRI, BNI, Mandiri

### Future Phases (not yet built)
| Page | Purpose |
|---|---|
| `/welcome.html` | QR scanner tablet at the entrance — welcome animation |
| `/guestbook.html` | Live arrival dashboard for the couple (PIN-protected) |
| `/admin.html` | Print QR cards for guests who didn't RSVP digitally |

---

## Google Sheets Integration

### Current (RSVP form)
RSVP submissions are sent to a Google Apps Script Web App and stored in Sheet 1 (`RSVP`).

Set the endpoint in `js/script.js`:
```js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
const SHEET_ID        = 'YOUR_SHEET_ID';
```

### Planned (Guest + Scan tracking)
Add two more tabs to the same spreadsheet:

| Sheet | Columns | Filled by |
|---|---|---|
| `RSVP` | Timestamp, Name, Attendance, Guests, Message | Form submissions |
| `Guests` | id, name, table, phone, pax | You (manually) |
| `Scans` | scanned_at, guest_id, guest_name, table, pax | Scanner at entrance |

---

## Dynamic Gallery

The gallery reads `images/manifest.json` (generated at container build time):
- Lists all photos from `images/groombride/` and `images/solo/`
- Fisher-Yates shuffled on every page load
- Split into two infinite-scroll rows (forward + reverse)
- Clicking any photo opens the lightbox

To add new photos: drop them in `images/groombride/`, rebuild the container. No code changes needed.

---

## Deployment

The site runs in an **nginx:alpine** container on port 9000.

```bash
# Build
podman build -t wedding-invite .

# Run
podman run -p 9000:9000 wedding-invite
```

CI/CD: push to `main` → GitHub Actions → SSH deploy → `podman-compose up --build -d`

### Cache Policy (nginx)
- HTML / CSS / JS → `no-cache, no-store, must-revalidate` (always fresh)
- Images / fonts → `public, immutable, 30d` (long-lived)

---

## Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+  
WebCrypto API required for QR generation (all modern browsers).

---

## Credits
- Photos: Personal pre-wedding photography of Jei & Angie
- Fonts: Google Fonts (Cormorant Garamond, Great Vibes, Montserrat) + Blacksword (self-hosted)
- QR generation: [qrcodejs](https://github.com/davidshimjs/qrcodejs)
- Built with: Pure HTML5, CSS3, Vanilla JavaScript, nginx, Podman
