/**
 * CARD FOOTER MESSAGES (mottos)
 * Edit the text here to change what is printed at the bottom of the card.
 */
export const MOTTOS = [
  { id: 'official', text: 'Akidar Mu Cigaban Yankin Mu', hint: 'For members who hold an official position' },
  { id: 'member', text: 'Ina Goyon Bayan Tafiyar Doko Ina Mafita', hint: 'For ordinary community members' },
];

export const CUSTOM_MOTTO_ID = 'custom';

/** Which message is suggested for a position (the member can still choose the other one). */
export function suggestMottoId(position) {
  if (!position) return 'official';
  return position.official ? 'official' : 'member';
}
