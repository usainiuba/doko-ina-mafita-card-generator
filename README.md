# Doko Ina Mafita: Digital Membership Card Generator

A free, one-page web app where members of the Doko Ina Mafita community create their own digital membership card
(photo + name + Local Government + Ward + position) and download it as a high-quality PNG image.

**Everything happens inside the member's own phone/browser. No server, no database, no account.**

> Version 1 is set up for **Jigawa State**: the State is fixed to Jigawa and only Jigawa's 27 Local Government Areas are offered
> (see "Change the State / LGA lock" below).

---

## Main features

- One-page, mobile-first design (Android, iPhone, tablet, desktop)
- Live card preview that updates as you type
- Photo upload from gallery or camera (JPG / PNG / WEBP), with zoom and move controls so the face fits the frame
- Phone photo rotation is handled automatically; big photos are shrunk safely
- Searchable list of 20 community positions + "Other / Custom position"
- Two standard footer messages (official position / community member) + optional custom message (admin switch)
- PNG export at **1600 × 1008 px** (sharp on screens and in print)
- Safe file names, e.g. `Doko-Ina-Mafita-Usaini-Uba.png`
- Fallbacks when a phone blocks downloads: press-and-hold image, "Open image", "Share / Save"
- Privacy by design: photos never leave the device, nothing is stored

## Screenshots

| Form (mobile) | Live preview | Downloaded card |
|---|---|---|
| _add screenshot_ | _add screenshot_ | _add screenshot_ |

Put your screenshots in `public/assets/` and link them here.

## Technology

React 18 · Vite 5 · Tailwind CSS 3 · lucide-react (icons) · html-to-image (PNG export). Deployed as a static site (Vercel / Netlify).

## Project structure

```
DOKO_INA_MAFITA_MEMBERSHIP_CARD_GENERATOR/
├── public/
│   ├── logo/logo.svg            <- default emblem (replace/add your official logo here)
│   └── assets/                  <- extra static files / screenshots
├── src/
│   ├── components/              Header, MembershipForm, PhotoUpload, SearchableSelect,
│   │                            MembershipCard (the card design), CardPreview, DownloadButton, Footer, Logo
│   ├── config/                  brand.js, positions.js, mottos.js, states.js, lgas.js   <- ALL editable settings
│   ├── hooks/useCardGenerator.js
│   ├── utils/                   validation, image checks/cropping, PNG export, file names
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── scripts/check-data.mjs       data sanity test (states, LGAs, positions)
├── docs/DEPLOYMENT.md           beginner guide: GitHub + Vercel (and Netlify)
├── vercel.json  vite.config.js  tailwind.config.js  postcss.config.js
├── package.json  README.md  LICENSE  .gitignore
```

## Requirements

- Node.js 18 or newer (https://nodejs.org, choose "LTS")
- npm (comes with Node.js)

## Install, run, build

```bash
npm install          # downloads the libraries (also creates package-lock.json the first time)
npm run dev          # opens a local test site (usually http://localhost:5173)
npm run build        # makes the production site in the "dist" folder
npm run preview      # test the production build locally
npm run test:data    # checks the state / LGA / position data
```

To test on your phone while developing: run `npm run dev -- --host`, then open the "Network" address on a phone connected to the same Wi-Fi.
(Photo upload works on http, but the Share button needs https, which you get after deploying.)

> Tip: commit `package-lock.json` to GitHub after your first `npm install`, so every deployment uses exactly the same library versions.

---

## How to change things (all in `src/config/`)

### Add / remove / rename / reorder positions: `positions.js`
Each line is one position. The list order is the dropdown order.

```js
{ id: 'vice-chairman', label: 'Vice Chairman', official: true },
```
- `id` must be unique (letters, numbers, dashes). `label` is shown on the card.
- `official: true` suggests the "Akidar Mu Cigaban Yankin Mu" message; `false` suggests the community-member message.
- `custom: true` shows a box where the member types their own position (only the "Other" line uses this).

### Edit the footer messages: `mottos.js`
Change the `text` of the two entries. To let members write their own message, set `allowCustomFooter: true` in `brand.js`.

### Change brand colours: `brand.js` → `colors`
Change the hex codes. The card and the whole page follow automatically.

### Replace the logo
1. Copy your logo (PNG or SVG, square, transparent background is best) into `public/logo/`, e.g. `public/logo/logo.png`.
2. In `brand.js` set `logoUrl: '/logo/logo.png'`.
3. Replace `public/logo/logo.svg` too if you want the browser tab icon to match.

### Change the State / LGA lock: `brand.js` → `region`
```js
region: { lockedState: 'Jigawa', allowManualLga: false }
```
- `lockedState: 'Jigawa'` → State fixed, only Jigawa's 27 LGAs.
- `lockedState: null` → all 36 states + FCT with their LGAs (members can choose their State).
- `allowManualLga: true` → adds an "Other (type manually)" option in the LGA list.
- To use another single state, write its exact name (e.g. `'Kano'`).

### Update states and LGAs: `states.js`, `lgas.js`
Edit the list of that state. The spelling of the state must be identical in both files.
Run `npm run test:data` afterwards to catch mistakes (it checks counts per state; update the expected numbers in `scripts/check-data.mjs` if the official number of LGAs changes).
Please have the LGA spellings checked by a member before large-scale use.

### Other switches: `brand.js` → `features`
- `requirePhoto: false` lets members download a card without a photograph.
- `showMembershipNumber: true` shows an OPTIONAL membership-number box. Only use it for numbers supplied by an authorised administrator; the app never invents numbers, dates or "verified" labels.

### Change the card design: `src/components/MembershipCard.jsx`
The card is drawn at 800 × 504 px with plain inline styles (so the downloaded PNG always matches the preview).

---

## Troubleshooting

### Photo will not upload
- Only JPG, PNG and WEBP are accepted (HEIC from some iPhones is not): in iPhone Settings → Camera → Formats choose "Most Compatible", or pick the photo from the gallery (Safari converts it automatically).
- The photo must be under 12 MB and at least 200 px wide (change in `brand.js` → `limits`).
- If "could not be read as a picture": the file may be damaged or renamed; choose another photo.

### PNG download does not start
- Wait for "Creating your card…" to finish (a few seconds on slow phones).
- In the "Your card is ready" panel press and hold the picture and choose Save image, or tap "Open image" / "Share / Save".
- Some in-app browsers (Facebook, WhatsApp, Instagram) block downloads. Tap "⋮ / Share → Open in Chrome (or Safari)".
- If the photo is missing in the PNG: remove the photo, add it again, then download again.
- Fonts: the card uses the phone's built-in fonts on purpose, so downloads never fail because of a missing web font.

### Build problems
- Delete `node_modules` and `package-lock.json`, run `npm install` again.
- Make sure `node -v` shows 18 or higher.

## Privacy and security

- Photographs and details are processed **only in the browser** to draw the card. They are not uploaded, saved, or sent to any third party.
- No localStorage/cookies/analytics. Temporary image data is cleared on Reset and when the page is closed.
- Photos are checked (type, size, readable image) and re-drawn on a canvas, which strips hidden metadata such as GPS location.
- All text fields are validated and shown as plain text (no HTML injection).
- No API keys or secrets exist in this project.
- The card says "Self-generated digital membership card · Not an official verification". It must not be presented as an official membership record unless a future authorised verification system is built.

## Deployment

See `docs/DEPLOYMENT.md` (GitHub → Vercel, step by step; Netlify alternative).

## Ideas for the future

- Admin-issued membership numbers and a verification page/QR code (needs a secure backend and admin sign-in)
- Hausa / English language switch
- Several card designs/templates
- Optional crop by dragging the photo
- PDF / print-ready sheet export
