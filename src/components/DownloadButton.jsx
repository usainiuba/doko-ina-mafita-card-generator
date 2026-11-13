import { Download, RotateCcw, Loader2, Share2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DownloadButton({ status, error, result, canShare, onDownload, onReset, onShare }) {
  const working = status === 'working';
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onDownload}
        disabled={working}
        className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-secondary px-5 text-base font-bold uppercase tracking-wide text-white shadow-lg transition active:scale-[0.99] disabled:opacity-70"
      >
        {working ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Download className="h-5 w-5" aria-hidden="true" />}
        {working ? 'Creating your card…' : 'Download membership card'}
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={working}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 disabled:opacity-60"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset form
      </button>

      {status === 'error' && (
        <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
          <span>{error || 'Something went wrong while creating the card. Please try again.'}</span>
        </div>
      )}

      {result && status === 'done' && (
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
          <p className="flex items-start gap-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
            Your card is ready. Check your phone's Downloads or Gallery.
          </p>
          <img src={result.url} alt="Your finished membership card" className="w-full rounded-xl border border-emerald-200" />
          <p className="text-xs text-slate-600">
            If the download did not start, press and hold the picture above and choose “Download image” or “Save image”.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={result.url} download={result.filename} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-secondary shadow-sm">
              <Download className="h-4 w-4" aria-hidden="true" /> Download again
            </a>
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-secondary shadow-sm">
              Open image
            </a>
            {canShare && (
              <button type="button" onClick={onShare} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-secondary shadow-sm">
                <Share2 className="h-4 w-4" aria-hidden="true" /> Share / Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
