/** Makes a safe file name such as "Doko-Ina-Mafita-Usaini-Uba.png" from a member's name. */
export function slugifyName(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')       // remove accents
    .replace(/[^A-Za-z0-9]+/g, '-')        // anything unsafe -> dash
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .replace(/-+$/g, '');
}

export function buildFilename(name) {
  const slug = slugifyName(name);
  return slug ? `Doko-Ina-Mafita-${slug}.png` : 'Doko-Ina-Mafita-Membership-Card.png';
}
