import { useLayoutEffect, useRef, useState } from 'react';
import MembershipCard from './MembershipCard.jsx';
import { CARD_WIDTH, CARD_HEIGHT } from './cardSize.js';

/** Shows the card scaled down to fit the screen. (The PNG is made from a separate full-size hidden copy.) */
export default function CardPreview({ data, photoUrl }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => setScale(Math.min(1, el.clientWidth / CARD_WIDTH));
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full"
      style={{ height: CARD_HEIGHT * scale, borderRadius: 28 * scale, boxShadow: '0 18px 40px rgba(3,45,28,0.35)' }}
      aria-label="Membership card preview"
      role="img"
    >
      <div style={{ width: CARD_WIDTH, height: CARD_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <MembershipCard data={data} photoUrl={photoUrl} />
      </div>
    </div>
  );
}
