/**
 * BRAND + FEATURE SETTINGS
 * Change colours, the logo and the on/off switches here. Nothing else needs editing.
 */
export const brand = {
  name: 'Doko Ina Mafita',
  appTitle: 'Digital Membership Card Generator',
  tagline: 'Ilimi • Taimako • Haɗin Kai',

  // Official logo: put the file in /public/logo/ (for example logo.png) and write '/logo/logo.png' here.
  // Leave as null to use the built-in text/emblem logo.
  logoUrl: null,

  colors: {
    primary: '#064B2E',
    secondary: '#087443',
    deep: '#032D1C',
    gold: '#D9A441',
    goldLight: '#F2D27A',
    white: '#FFFFFF',
    muted: '#A8C5B2',
  },

  features: {
    // true  = a photograph is required before a card can be downloaded
    // false = the administrator allows cards without a photograph
    requirePhoto: true,
    // true = members may type their own footer message (in addition to the two standard ones)
    allowCustomFooter: false,
    // true = show an OPTIONAL "Membership number" field (number must be supplied by an authorised administrator)
    showMembershipNumber: false,
  },

  // REGION LOCK
  // lockedState: 'Jigawa'  -> the card is only for Jigawa State: the State is fixed and ONLY Jigawa's 27 LGAs are offered.
  // lockedState: null      -> all 36 states + FCT and all their LGAs are offered again.
  // allowManualLga: false  -> members can only pick an LGA from the list (no free typing).
  region: {
    lockedState: 'Jigawa',
    allowManualLga: false,
  },

  limits: {
    maxPhotoMB: 12,
    minPhotoPixels: 200,
  },
};

/** Writes the brand colours into CSS variables so Tailwind classes (bg-primary, text-gold ...) follow brand.js */
export function applyBrandVariables() {
  const root = document.documentElement;
  const c = brand.colors;
  root.style.setProperty('--dim-primary', c.primary);
  root.style.setProperty('--dim-secondary', c.secondary);
  root.style.setProperty('--dim-deep', c.deep);
  root.style.setProperty('--dim-gold', c.gold);
  root.style.setProperty('--dim-gold-light', c.goldLight);
  root.style.setProperty('--dim-muted', c.muted);
}
