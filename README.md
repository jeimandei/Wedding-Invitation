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
│   └── script.js           # Nav, lightbox, RSVP form, parallax
├── images/
│   ├── groombride/         # Couple pre-wedding photos (37 photos)
│   ├── solo/               # Solo bride & groom portraits (6 photos)
│   └── assets/             # Design assets: florals, backgrounds, icons
└── README.md
```

---

## Design System

### Color Palette
| Name       | Hex       | Usage                          |
|------------|-----------|--------------------------------|
| Blush      | `#F7B5C1` | Primary accent, gradients      |
| Peach      | `#FFDAB9` | Dress code swatch              |
| Lilac      | `#C9A6C9` | Secondary accent, borders      |
| Lilac Dark | `#9B72A3` | Labels, icons, interactive     |
| Sage Green | `#9DC183` | Dress code swatch              |
| Cream      | `#FFFDD0` | Dress code swatch, inputs      |
| Ivory      | `#F5EEE6` | Section background             |
| Warm White | `#FBF7F4` | Page background                |
| Gold       | `#C9A96E` | Hero accents, date text        |

### Typography
- **Headings:** Cormorant Garamond (400, 500) — elegant serif
- **Script / Display:** Great Vibes — romantic cursive for names & footers
- **Body / Labels:** Montserrat (300, 400, 500, 600) — clean sans-serif

---

## Sections

1. **Hero** — Full-screen with couple photo, names, date, RSVP CTA, floral overlays
2. **Save the Date** — Blush/lilac gradient banner
3. **Our Story** — Three-chapter narrative with couple photos
4. **Quote** — Scripture verse over moody background
5. **Wedding Details** — Ceremony & reception cards with venue info
6. **Dress Code** — Garden Formal palette swatches
7. **Portraits** — Bride & groom solo portraits in a split layout
8. **Gallery** — 24-photo grid with lightbox (click any photo)
9. **RSVP** — Validated form with attendance & dietary fields
10. **Footer** — Names, date, quote

---

## Customization Guide

### Update Wedding Details
In `index.html`, search for these placeholders and replace:
- `October 18, 2025` → your wedding date
- `Cebu City, Philippines` → your location
- `Sto. Niño Parish Church` → your ceremony venue
- `Grand Ballroom` → your reception venue
- `4:00 PM` / `6:30 PM` → your ceremony/reception times
- `September 1, 2025` → your RSVP deadline
- `Mr. & Mrs. ___________` → parents' names
- The Maps links → your Google Maps URLs

### Swap the Hero Photo
The hero couple photo is currently `images/groombride/RESULT_0B0A9752.jpg`.
To change it, find `.hero__photo` in `index.html` and update the `src`.

### Add RSVP Backend
The form currently logs to the console. To connect a real backend:

**Option A — Formspree (easiest):**
```html
<form class="rsvp__form" action="https://formspree.io/f/YOUR_ID" method="POST">
```
Remove the `novalidate` and `id="rsvpForm"` attributes, and remove the JS form handler.

**Option B — EmailJS:**
Replace the `setTimeout` block in `script.js` with an EmailJS `send()` call.

**Option C — Custom backend:**
Replace the `console.log` + `setTimeout` with a `fetch()` POST to your API endpoint.

### Change Gallery Photos
Edit the `.gallery__grid` block in `index.html`. Each item is:
```html
<div class="gallery__item fade-in">
  <img src="images/groombride/FILENAME.jpg" alt="Jei and Angie" loading="lazy" />
</div>
```
Add, remove, or reorder items freely.

---

## Deployment

### Static Hosting (Recommended)
Upload the entire `wedding-website/` folder to any static host:
- **Netlify** — drag & drop the folder at netlify.com/drop
- **Vercel** — `vercel --prod` from the project root
- **GitHub Pages** — push to a repo and enable Pages in Settings
- **Cloudflare Pages** — connect your repo or upload directly

### Local Preview
Open `index.html` in any browser, or use a local server:
```bash
# Python
python3 -m http.server 3000

# Node (npx)
npx serve .
```

---

## Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Credits
- Photos: Personal pre-wedding photography of Jei & Angie
- Fonts: Google Fonts (Cormorant Garamond, Great Vibes, Montserrat)
- Design assets: Floral PNGs, backgrounds — sourced from project assets
- Built with: Pure HTML5, CSS3, and Vanilla JavaScript
