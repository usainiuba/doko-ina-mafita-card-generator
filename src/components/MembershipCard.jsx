import { forwardRef } from 'react';
import { brand } from '../config/brand.js';
import { CARD_WIDTH, CARD_HEIGHT } from './cardSize.js';
import Logo from './Logo.jsx';

const SERIF = 'Georgia, "Times New Roman", Times, serif';
const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const PATTERN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><g fill='none' stroke='#F2D27A' stroke-opacity='0.10' stroke-width='1.2'><rect x='18' y='18' width='36' height='36'/><rect x='18' y='18' width='36' height='36' transform='rotate(45 36 36)'/></g></svg>"
)}")`;

// font size by text length: [maxLength, fontSize]
function fit(text, steps) {
  const n = (text || '').length;
  for (const [max, size] of steps) if (n <= max) return size;
  return steps[steps.length - 1][1];
}

const clamp = (lines) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  overflowWrap: 'anywhere',
});

function Field({ label, text, placeholder, steps, lines, serif, color, weight = 700 }) {
  const c = brand.colors;
  const has = Boolean(text);
  const shown = has ? text : placeholder;
  const size = fit(shown, steps);
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 12, letterSpacing: 3, fontWeight: 700, color: c.gold, textTransform: 'uppercase', marginBottom: 3 }}>
        {label}
      </div>
      <div
        style={{
          ...clamp(lines),
          fontFamily: serif ? SERIF : SANS,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.15,
          color: color || c.white,
          opacity: has ? 1 : 0.4,
        }}
      >
        {shown}
      </div>
    </div>
  );
}

const MembershipCard = forwardRef(function MembershipCard({ data, photoUrl }, ref) {
  const c = brand.colors;
  const d = data || {};
  const mottoSize = fit(d.motto, [[38, 20], [52, 17], [999, 15]]);

  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        borderRadius: 28,
        background: `linear-gradient(135deg, ${c.deep} 0%, ${c.primary} 55%, ${c.secondary} 100%)`,
        fontFamily: SANS,
        color: c.white,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: PATTERN }} />
      <div style={{ position: 'absolute', inset: 12, border: `2px solid ${c.gold}`, borderRadius: 20, opacity: 0.55 }} />

      {/* TOP: brand */}
      <div style={{ position: 'absolute', left: 44, top: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
        {brand.logoUrl ? (
          <img src={brand.logoUrl} alt="" style={{ width: 60, height: 60, objectFit: 'contain' }} />
        ) : (
          <Logo size={60} />
        )}
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: c.goldLight, lineHeight: 1.1 }}>
            DOKO INA MAFITA
          </div>
          <div style={{ fontSize: 13, letterSpacing: 5, fontWeight: 600, color: c.muted, marginTop: 4 }}>MEMBERSHIP CARD</div>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 44, top: 36, textAlign: 'right' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            border: `1.5px solid ${c.gold}`,
            borderRadius: 999,
            color: c.gold,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          DIGITAL IDENTITY
        </div>
        {d.number ? (
          <div style={{ marginTop: 6, fontSize: 12, letterSpacing: 2, color: c.muted }}>NO. {d.number}</div>
        ) : null}
      </div>

      {/* LEFT: photo */}
      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 112,
          width: 220,
          height: 270,
          boxSizing: 'border-box',
          border: `5px solid ${c.gold}`,
          borderRadius: 20,
          overflow: 'hidden',
          background: c.deep,
        }}
      >
        {photoUrl ? (
          <img src={photoUrl} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 100 120" aria-hidden="true">
            <rect width="100" height="120" fill={c.deep} />
            <circle cx="50" cy="46" r="20" fill={c.secondary} />
            <path d="M12 120 C12 86 30 74 50 74 C70 74 88 86 88 120 Z" fill={c.secondary} />
          </svg>
        )}
      </div>

      {/* RIGHT: details */}
      <div
        style={{
          position: 'absolute',
          left: 302,
          top: 108,
          width: 454,
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Field label="Full Name" text={d.name} placeholder="YOUR FULL NAME" serif lines={2}
          steps={[[16, 38], [24, 32], [32, 26], [44, 22], [999, 19]]} />
        <Field label="Position" text={d.position} placeholder="YOUR POSITION" lines={2} color={c.goldLight}
          steps={[[22, 24], [34, 20], [999, 17]]} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Field label="State" text={d.state} placeholder="STATE" lines={1} weight={600} steps={[[14, 21], [999, 17]]} />
          <Field label="LGA" text={d.lga} placeholder="LOCAL GOVT" lines={2} weight={600} steps={[[14, 21], [24, 18], [999, 15]]} />
        </div>
        <Field label="Ward" text={d.ward} placeholder="YOUR WARD" lines={2} weight={600} steps={[[24, 21], [40, 18], [999, 15]]} />
      </div>

      {/* BOTTOM: motto */}
      <div
        style={{
          position: 'absolute',
          left: 44,
          right: 44,
          top: 426,
          height: 62,
          boxSizing: 'border-box',
          borderTop: `1.5px solid ${c.gold}`,
          paddingTop: 8,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            ...clamp(2),
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: mottoSize,
            lineHeight: 1.2,
            color: c.goldLight,
            opacity: d.motto ? 1 : 0.4,
          }}
        >
          {d.motto || 'Your footer message'}
        </div>
        <div style={{ marginTop: 4, fontSize: 10.5, letterSpacing: 1, color: c.muted }}>
          Self-generated digital membership card · Not an official verification
        </div>
      </div>
    </div>
  );
});

export default MembershipCard;
