// Quick data sanity check: node scripts/check-data.mjs   (also: npm run test:data)
import { STATES } from '../src/config/states.js';
import { LGAS } from '../src/config/lgas.js';
import { POSITIONS } from '../src/config/positions.js';

const expected = { Abia:17, Adamawa:21, 'Akwa Ibom':31, Anambra:21, Bauchi:20, Bayelsa:8, Benue:23, Borno:27, 'Cross River':18, Delta:25, Ebonyi:13, Edo:18, Ekiti:16, Enugu:17, Gombe:11, Imo:27, Jigawa:27, Kaduna:23, Kano:44, Katsina:34, Kebbi:21, Kogi:21, Kwara:16, Lagos:20, Nasarawa:13, Niger:25, Ogun:20, Ondo:18, Osun:30, Oyo:33, Plateau:17, Rivers:23, Sokoto:23, Taraba:16, Yobe:17, Zamfara:14, 'Federal Capital Territory':6 };
let problems = 0, total = 0;
const fail = (m) => { problems++; console.error('PROBLEM:', m); };

if (STATES.length !== 37) fail(`expected 37 states/FCT, got ${STATES.length}`);
for (const s of STATES) {
  const list = LGAS[s];
  if (!list) { fail(`no LGA list for ${s}`); continue; }
  total += list.length;
  if (list.length !== expected[s]) fail(`${s}: ${list.length} LGAs, expected ${expected[s]}`);
  if (new Set(list).size !== list.length) fail(`${s}: duplicate LGA names`);
  if (list.some((n) => !n || n !== n.trim())) fail(`${s}: empty or untrimmed LGA name`);
}
for (const k of Object.keys(LGAS)) if (!STATES.includes(k)) fail(`LGAS has unknown state key: ${k}`);
if (total !== 774) fail(`total LGAs ${total}, expected 774`);

const JIGAWA = ['Auyo','Babura','Biriniwa','Birnin Kudu','Buji','Dutse','Gagarawa','Garki','Gumel','Guri','Gwaram','Gwiwa','Hadejia','Jahun','Kafin Hausa','Kaugama','Kazaure','Kiri Kasama','Kiyawa','Maigatari','Malam Madori','Miga','Ringim','Roni','Sule Tankarkar','Taura','Yankwashi'];
if (JSON.stringify(LGAS['Jigawa']) !== JSON.stringify(JIGAWA)) fail('Jigawa LGA list differs from the 27 official LGAs');

const ids = POSITIONS.map((p) => p.id);
if (new Set(ids).size !== ids.length) fail('duplicate position ids');
if (POSITIONS.filter((p) => p.custom).length !== 1) fail('exactly one custom position expected');

console.log(`States: ${STATES.length}, LGAs: ${total}, positions: ${POSITIONS.length}`);
console.log(problems ? `${problems} problem(s) found` : 'DATA OK');
process.exit(problems ? 1 : 0);
