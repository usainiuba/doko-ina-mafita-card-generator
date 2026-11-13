import { OTHER_LGA, LGAS } from '../config/lgas.js';
import { findPosition, tidy } from './cardData.js';
import { CUSTOM_MOTTO_ID } from '../config/mottos.js';

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const PLACE_RE = /^[\p{L}\p{N}\p{M} .,'’\/&()-]+$/u;
const NUMBER_RE = /^[A-Za-z0-9\-\/]+$/;

/** Returns an object { fieldName: "message" } – empty object means everything is valid. */
export function validateForm(form, hasPhoto, features, region = { lockedState: null, allowManualLga: true }) {
  const errors = {};

  const name = tidy(form.fullName);
  if (!name) errors.fullName = 'Please enter your full name.';
  else if (name.length < 2) errors.fullName = 'Name is too short.';
  else if (name.length > 60) errors.fullName = 'Name must be 60 characters or fewer.';
  else if (!NAME_RE.test(name)) errors.fullName = "Use letters, spaces, full stops, apostrophes or hyphens only.";

  if (!form.stateName) errors.stateName = 'Please select your State.';
  else if (region.lockedState && form.stateName !== region.lockedState) errors.stateName = `This card is only for ${region.lockedState} State.`;

  if (form.lga === OTHER_LGA && !region.allowManualLga) {
    errors.lga = 'Please select your Local Government Area from the list.';
  } else if (form.lga === OTHER_LGA) {
    const manual = tidy(form.lgaManual);
    if (!manual) errors.lga = 'Please type your Local Government Area.';
    else if (manual.length < 2 || manual.length > 60 || !PLACE_RE.test(manual)) errors.lga = 'Please enter a valid Local Government Area.';
  } else if (!form.lga) {
    errors.lga = 'Please select your Local Government Area.';
  } else if (!(LGAS[form.stateName] || []).includes(form.lga)) {
    errors.lga = `Please select a Local Government Area in ${form.stateName || 'your State'}.`;
  }

  const ward = tidy(form.ward);
  if (!ward) errors.ward = 'Please enter your Ward.';
  else if (ward.length < 2 || ward.length > 60 || !PLACE_RE.test(ward)) errors.ward = 'Please enter a valid Ward name.';

  const position = findPosition(form.positionId);
  if (!position) errors.positionId = 'Please select your position.';
  else if (position.custom) {
    const custom = tidy(form.customPosition);
    if (!custom) errors.customPosition = 'Please type your position.';
    else if (custom.length < 2 || custom.length > 50) errors.customPosition = 'Position must be 2 to 50 characters.';
  }

  if (form.mottoId === CUSTOM_MOTTO_ID) {
    const f = tidy(form.customFooter);
    if (f.length < 2 || f.length > 80) errors.customFooter = 'Footer message must be 2 to 80 characters.';
  }

  if (features.showMembershipNumber) {
    const n = tidy(form.membershipNumber);
    if (n && (n.length > 30 || !NUMBER_RE.test(n))) errors.membershipNumber = 'Use letters, numbers, dashes or slashes only (max 30).';
  }

  if (features.requirePhoto && !hasPhoto) errors.photo = 'Please choose your photograph.';

  return errors;
}
