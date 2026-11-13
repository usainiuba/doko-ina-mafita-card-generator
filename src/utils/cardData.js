import { POSITIONS } from '../config/positions.js';
import { MOTTOS, CUSTOM_MOTTO_ID } from '../config/mottos.js';
import { OTHER_LGA } from '../config/lgas.js';

export function tidy(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function findPosition(positionId) {
  return POSITIONS.find((p) => p.id === positionId) || null;
}

/** Turns the raw form values into the exact text printed on the card. */
export function getCardData(form) {
  const position = findPosition(form.positionId);
  const positionText = position
    ? (position.custom ? tidy(form.customPosition) : position.label)
    : '';

  let motto = '';
  if (form.mottoId === CUSTOM_MOTTO_ID) {
    motto = tidy(form.customFooter);
  } else {
    const found = MOTTOS.find((m) => m.id === form.mottoId);
    motto = found ? found.text : '';
  }

  return {
    name: tidy(form.fullName),
    position: positionText,
    state: form.stateName || '',
    lga: form.lga === OTHER_LGA ? tidy(form.lgaManual) : (form.lga || ''),
    ward: tidy(form.ward),
    motto,
    number: tidy(form.membershipNumber),
  };
}
