import { brand } from '../config/brand.js';

/** Built-in Doko Ina Mafita emblem (open book + 8-point star). Replace via brand.logoUrl when the official logo is ready. */
export default function Logo({ size = 48 }) {
  const c = brand.colors;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Doko Ina Mafita logo">
      <circle cx="32" cy="32" r="30" fill={c.deep} stroke={c.gold} strokeWidth="3" />
      <rect x="26.5" y="11" width="11" height="11" fill={c.gold} />
      <rect x="26.5" y="11" width="11" height="11" fill={c.gold} transform="rotate(45 32 16.5)" />
      <circle cx="32" cy="16.5" r="2.2" fill={c.deep} />
      <path d="M11 31 L32 37 L53 31 L53 47 L32 53 L11 47 Z" fill="#FCFAF2" />
      <path d="M32 37 L32 53" stroke={c.gold} strokeWidth="2" />
      <path d="M16 36 L28 39.4 M16 41 L28 44.4 M36 39.4 L48 36 M36 44.4 L48 41" stroke={c.secondary} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
