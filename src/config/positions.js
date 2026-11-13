/**
 * COMMUNITY POSITIONS
 * Add, remove, rename or reorder lines freely. The order here is the order in the dropdown.
 *
 *   id       : unique short code (letters, numbers, dashes). Never reuse an id.
 *   label    : the text shown in the list and printed on the card
 *   official : true  -> the card suggests the "official position" footer message
 *              false -> the card suggests the "community member" footer message
 *   custom   : true  -> shows an extra box where the member types their own position
 */
export const POSITIONS = [
  { id: 'chairman', label: 'Chairman', official: true },
  { id: 'patron', label: 'Patron', official: true },
  { id: 'special-senior-adviser-1', label: 'Special Senior Adviser 1', official: true },
  { id: 'special-senior-adviser-2', label: 'Special Senior Adviser 2', official: true },
  { id: 'director-social-media-1', label: 'Director, Social Media 1', official: true },
  { id: 'director-social-media-2', label: 'Director, Social Media 2', official: true },
  { id: 'pro-1', label: 'Public Relations Officer (PRO) 1', official: true },
  { id: 'pro-2', label: 'Public Relations Officer (PRO) 2', official: true },
  { id: 'admin', label: 'Admin', official: true },
  { id: 'secretary', label: 'Secretary', official: true },
  { id: 'assistant-secretary', label: 'Assistant Secretary', official: true },
  { id: 'treasurer', label: 'Treasurer', official: true },
  { id: 'financial-secretary', label: 'Financial Secretary', official: true },
  { id: 'organising-secretary', label: 'Organising Secretary', official: true },
  { id: 'welfare-officer', label: 'Welfare Officer', official: true },
  { id: 'youth-coordinator', label: 'Youth Coordinator', official: true },
  { id: 'women-coordinator', label: 'Women Coordinator', official: true },
  { id: 'media-team', label: 'Media Team', official: true },
  { id: 'community-member', label: 'Community Member', official: false },
  { id: 'other', label: 'Other / Custom Position', official: true, custom: true },
];
