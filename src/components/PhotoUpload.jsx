import { useEffect, useRef } from 'react';
import { ImagePlus, Trash2, Loader2, RefreshCw } from 'lucide-react';

function Slider({ id, label, value, min, max, step, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-full accent-[var(--dim-secondary)]"
      />
    </div>
  );
}

export default function PhotoUpload({ photo, busy, error, onSelect, onRemove, onAdjust }) {
  const inputRef = useRef(null);

  // clear the file input whenever the photo is removed/reset so the same file can be chosen again
  useEffect(() => {
    if (!photo && inputRef.current) inputRef.current.value = '';
  }, [photo]);

  function handleChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) onSelect(file);
    e.target.value = '';
  }

  return (
    <div>
      <input
        ref={inputRef}
        id="photo-input"
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        className="sr-only"
        aria-describedby={error ? 'photo-error' : 'photo-hint'}
      />

      {!photo ? (
        <label
          htmlFor="photo-input"
          className={`flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white hover:border-secondary'}`}
        >
          {busy ? <Loader2 className="h-8 w-8 animate-spin text-secondary" aria-hidden="true" /> : <ImagePlus className="h-8 w-8 text-secondary" aria-hidden="true" />}
          <span className="text-base font-semibold text-deep">{busy ? 'Preparing your photo…' : 'Tap to choose your photograph'}</span>
          <span id="photo-hint" className="text-xs text-slate-500">JPG, PNG or WEBP · from your gallery or camera</span>
        </label>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-start gap-3">
            <img src={photo.cropUrl} alt="Your selected photograph" className="h-28 w-[91px] flex-none rounded-lg border-2 border-gold object-cover" />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="truncate text-sm font-semibold text-deep" title={photo.fileName}>{photo.fileName}</p>
              <div className="flex flex-wrap gap-2">
                <label htmlFor="photo-input" className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-semibold text-secondary">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" /> Change photo
                </label>
                <button type="button" onClick={onRemove} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-red-50 px-3 text-sm font-semibold text-red-600">
                  <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 grid gap-1 sm:grid-cols-3 sm:gap-4">
            <Slider id="crop-zoom" label="Zoom" min={1} max={3} step={0.05} value={photo.zoom} onChange={(v) => onAdjust({ zoom: v })} />
            <Slider id="crop-x" label="Move left / right" min={0} max={100} step={1} value={photo.focusX} onChange={(v) => onAdjust({ focusX: v })} />
            <Slider id="crop-y" label="Move up / down" min={0} max={100} step={1} value={photo.focusY} onChange={(v) => onAdjust({ focusY: v })} />
          </div>
        </div>
      )}

      {error && <p id="photo-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
