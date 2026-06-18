# Jei & Angie — Wedding Invitation Website

A bespoke, Bridgerton-inspired romantic garden wedding invitation website.

---

## Project Structure

```
wedding-website/
├── index.html              # Main invite page (splash, RSVP, QR pass, wishes)
├── welcome.html            # PIN-gated QR scanner for entrance check-in
├── guestbook.html          # PIN-gated live arrival dashboard
├── admin.html              # PIN-gated admin panel (QR cards, import, reset)
├── apps-script.js          # Google Apps Script source (deploy separately)
├── css/
│   └── styles.css          # Full stylesheet with design tokens
├── js/
│   └── script.js           # Nav, lightbox, RSVP form, QR pass, wishes
├── images/
│   ├── groombride/         # Couple pre-wedding photos (compressed ≤350 KB each)
│   ├── solo/               # Solo bride & groom portraits
│   └── assets/             # Design assets: florals, backgrounds, icons, qris.png
├── audio/                  # Background music
├── fonts/                  # Self-hosted Blacksword OTF
├── Containerfile           # nginx:alpine container definition
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

## Pages

### `index.html` — Main Invite Page

Sections:
1. **Splash** — Fullscreen landing with guest name resolved from `?to=` URL param
2. **Hero** — Couple photo, names, countdown timer, scroll cue
3. **Save the Date** — Date & location banner
4. **Quote** — Scripture verse (Song of Solomon 3:4) over full-bleed photo
5. **Wedding Details** — Ceremony & reception cards
6. **Dress Code** — Garden Formal palette guide
7. **Portraits** — Bride & groom solo portraits
8. **Gallery** — Dynamic infinite carousel (reads `images/manifest.json`, shuffled on load)
9. **RSVP** — Validated form → Google Sheets via Apps Script
10. **QR Entrance Pass** — Personal QR code (shown only when `?to=<id>` is in URL)
11. **Messages & Wishes** — Grid of guest messages from RSVP sheet, auto-refreshes after submit
12. **Footer** — Names, date, credit

### `welcome.html` — Entrance Scanner (PIN-gated)

Used by staff at the venue to check in guests via QR code scan.

- Requires PIN to access (triple-hash verified — see [PIN Security](#pin-security))
- Scans guest QR codes (`?to=<guestId>` format)
- Looks up guest in Guests sheet (name, table, pax)
- Counts current scan rows to assign a sequential **Gift Tag number** (first scan = #1)
- Shows a welcome overlay with guest name, table assignment, and gift tag number
- Logs the scan to the Scans sheet (via Apps Script, fire-and-forget)
- Auto-dismisses after 10 seconds; staff can tap "Next Guest →" to dismiss early

### `guestbook.html` — Live Arrival Dashboard (PIN-gated)

Real-time view of all checked-in guests, sourced from the Scans sheet.

- Requires PIN to access
- Shows scan log with timestamps, guest name, table, pax, and gift tag number

### `admin.html` — Admin Panel (PIN-gated)

Full guest management interface.

- Requires PIN; **Lock** button clears session and returns to PIN gate
- **Generate IDs** — triggers `generateIds()` in Apps Script to hash names → IDs
- **Print All Cards** — opens browser print dialog for all QR cards
- **Reset All** — opens a confirmation modal, then clears Scans + RSVP + Guests sheets in one call
- **Import Guest List** — upload a CSV to replace the Guests sheet:
  - Download Template button provides the correct column format
  - CSV is parsed client-side, sent to Apps Script, IDs generated automatically
- **Configuration** — override Sheet ID and Apps Script URL via `localStorage`; persists across page reloads without changing source code
- **QR Card Grid** — shows all guests with their personal QR codes (`/?to=<guestId>`)

---

## Guest QR System

Each guest receives a personalized invite link: `yoursite.com/?to=<guestId>`

The same URL is the entrance scan code — no separate QR needed.

### How IDs Are Generated

1. Guest name is normalized: `trim().toLowerCase()`
2. SHA-256 of `name + SALT` → first 16 hex characters = the guest ID
3. The salt (`ShadowRubyAsh120122`) lives in `apps-script.js` and matches the client-side hash in `js/script.js`
4. IDs are stored in column A of the Guests sheet via `generateIds()` or `importGuests`

### Invite Link Flow (`index.html`)

- `?to=<16-char hex>` → detected as ID → Guests sheet lookup → pre-fills RSVP name (read-only), shows QR
- `?to=Name` → legacy name-based path → hashes name client-side → validates against Guests sheet
- No `?to=` → guest can type their own name; RSVP form is open

### Entrance Scan Flow (`welcome.html`)

- Scans any URL containing `?to=` or `?id=` param
- Looks up ID in Guests sheet
- Fetches Scans sheet in parallel to count rows → assigns gift tag = `scanRows.length + 1`
- Logs scan with gift tag to Scans sheet

### RSVP Logic

- On submit, checks RSVP sheet first — if name already found, shows "You've already RSVP'd" without re-submitting
- Cross-checks Guests sheet: listed guests get a "You're on the list!" message; unlisted guests get a warm "thank you for your wishes" message
- Apps Script flags each submission `Listed: YES/NO` in the RSVP sheet

### QRIS Gift Modal

- Hidden behind a subtle "💝 Send a gift" button — tasteful, not pushy
- Shows the couple's QRIS code (`images/assets/qris.png`)
- Compatible with GoPay, OVO, Dana, ShopeePay, BCA, BRI, BNI, Mandiri

---

## Google Sheets Setup

### Spreadsheet ID
```
1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o
```
Share as **"Anyone with the link → Viewer"** (required for public gviz reads).

### Sheet Tabs & Columns

| Sheet    | Columns |
|----------|---------|
| `RSVP`   | Timestamp · Guest Name · Attendance · Guests · Message · Listed |
| `Guests` | id (auto) · name · table · phone · pax |
| `Scans`  | scanned_at · guest_id · guest_name · table · pax · gift_tag |

### Apps Script Setup

1. Open the spreadsheet → **Extensions → Apps Script**
2. Paste the contents of `apps-script.js`, save
3. Run `generateIds()` once to populate column A of the Guests sheet
4. **Deploy → New deployment** → Web App → Execute as: Me → Who has access: Anyone
5. Copy the Web App URL

### Apps Script Actions

| Action | Triggered by |
|--------|-------------|
| `scan` | `welcome.html` on each successful scan |
| `generateIds` | Admin page "Generate IDs" button |
| `importGuests` | Admin page CSV import |
| `resetAll` | Admin page "Reset All" (clears Scans + RSVP + Guests) |
| _(default)_ | RSVP form submission |

> **After any code change** to `apps-script.js`, create a **new deployment version** — editing existing deployments does not update the live endpoint.

---

## Configuration

Sheet ID and Apps Script URL can be overridden without touching source files via the **Configuration** panel on the admin page. Values are saved to `localStorage` (`wb_sheet_id` / `wb_script_url`) and read by all pages on load, with hardcoded values as fallback.

---

## PIN Security

All three gated pages (`welcome.html`, `admin.html`, `guestbook.html`) verify the PIN using a triple-hash check (SHA-1 + SHA-256 + SHA-512 computed in parallel via the Web Crypto API). No plaintext PIN is stored in source.

### `PIN_HASHES` structure (all three pages)

```js
const PIN_HASHES = [
  {
    sha1:   '<sha1 of pin>',
    sha256: '<sha256 of pin>',
    sha512: '<sha512 of pin>',
  },
  // add more entries for additional PINs
];
```

### Adding a new PIN

```bash
echo -n "YOURPIN" | sha1sum
echo -n "YOURPIN" | sha256sum
echo -n "YOURPIN" | sha512sum
```

Paste the three hashes as a new object in `PIN_HASHES` in each file.

---

## Dynamic Gallery

The gallery reads `images/manifest.json` (generated at container build time):
- Lists all photos from `images/groombride/` and `images/solo/`
- Fisher-Yates shuffled on every page load
- Split into two infinite-scroll rows (forward + reverse)
- Clicking any photo opens the lightbox

To add new photos: drop them in `images/groombride/`, rebuild the container.

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
Web Crypto API required for PIN verification and QR ID generation (all modern browsers).

---

## Credits
- Photos: Personal pre-wedding photography of Jei & Angie
- Fonts: Google Fonts (Cormorant Garamond, Great Vibes, Montserrat) + Blacksword (self-hosted)
- QR generation: [qrcodejs](https://github.com/davidshimjs/qrcodejs)
- QR scanning: [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- Built with: Pure HTML5, CSS3, Vanilla JavaScript, nginx, Podman
