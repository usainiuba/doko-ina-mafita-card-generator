import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/** A type-to-search drop-down that works with touch and keyboard. options = [{ value, label }] */
export default function SearchableSelect({ id, options, value, onChange, onBlur, placeholder, disabled, invalid, describedBy }) {
  const listId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    function onOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, []);

  function choose(option) {
    onChange(option.value);
    setOpen(false);
    setQuery('');
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && filtered[active]) {
        e.preventDefault();
        choose(filtered[active]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        disabled={disabled}
        value={open ? query : selected ? selected.label : ''}
        placeholder={selected ? selected.label : placeholder}
        onFocus={() => { setOpen(true); setActive(0); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={`w-full min-h-[48px] rounded-xl border bg-white px-4 pr-11 text-base focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-slate-100 disabled:text-slate-400 ${invalid ? 'border-red-500' : 'border-slate-300'}`}
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
      {open && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {filtered.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No match found</li>}
          {filtered.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => choose(o)}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-4 py-3 text-base ${i === active ? 'bg-emerald-50' : ''} ${o.value === value ? 'font-semibold text-secondary' : 'text-slate-800'}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
