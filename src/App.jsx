import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { brand } from './config/brand.js';
import { CUSTOM_MOTTO_ID, suggestMottoId } from './config/mottos.js';
import { findPosition, getCardData } from './utils/cardData.js';
import { validateForm } from './utils/validation.js';
import { validateImageFile } from './utils/imageValidation.js';
import { loadImageToCanvas, cropToFrame } from './utils/imageProcessing.js';
import { buildFilename } from './utils/filename.js';
import { canShareImage, shareImage } from './utils/generateCard.js';
import useCardGenerator from './hooks/useCardGenerator.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MembershipForm from './components/MembershipForm.jsx';
import MembershipCard from './components/MembershipCard.jsx';
import CardPreview from './components/CardPreview.jsx';
import DownloadButton from './components/DownloadButton.jsx';

const makeInitialForm = () => ({
  fullName: '',
  stateName: brand.region.lockedState || '',
  lga: '',
  lgaManual: '',
  ward: '',
  positionId: '',
  customPosition: '',
  mottoId: 'official',
  customFooter: '',
  membershipNumber: '',
});

const DEFAULT_CROP = { zoom: 1, focusX: 50, focusY: 30 };

export default function App() {
  const [form, setForm] = useState(makeInitialForm);
  const [photo, setPhoto] = useState(null);          // { cropUrl, fileName, zoom, focusX, focusY }
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [touched, setTouched] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [canShare, setCanShare] = useState(false);

  const sourceRef = useRef(null);       // the decoded photograph (kept in memory only)
  const exportRef = useRef(null);       // hidden full-size card used to make the PNG
  const mottoChosenByUser = useRef(false);

  const { status, error, result, generate, clear } = useCardGenerator(exportRef);

  const data = useMemo(() => getCardData(form), [form]);
  const allErrors = useMemo(() => validateForm(form, Boolean(photo), brand.features, brand.region), [form, photo]);

  const errors = useMemo(() => {
    const out = {};
    Object.keys(allErrors).forEach((key) => {
      if (showAll || touched[key]) out[key] = allErrors[key];
    });
    if (photoError) out.photo = photoError;
    return out;
  }, [allErrors, touched, showAll, photoError]);

  const handleChange = useCallback((name, value) => {
    if (name === 'mottoId') mottoChosenByUser.current = true;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'stateName') {
        next.lga = '';
        next.lgaManual = '';
      }
      if (name === 'positionId' && !mottoChosenByUser.current && prev.mottoId !== CUSTOM_MOTTO_ID) {
        next.mottoId = suggestMottoId(findPosition(value));
      }
      return next;
    });
  }, []);

  const handleBlur = useCallback((name) => setTouched((t) => ({ ...t, [name]: true })), []);

  const handlePhotoSelect = useCallback(async (file) => {
    setPhotoError('');
    const check = validateImageFile(file);
    if (!check.ok) {
      setPhotoError(check.error);
      return;
    }
    setPhotoBusy(true);
    try {
      const canvas = await loadImageToCanvas(file);
      sourceRef.current = canvas;
      setPhoto({ cropUrl: cropToFrame(canvas, DEFAULT_CROP), fileName: file.name, ...DEFAULT_CROP });
      clear();
    } catch (e) {
      setPhotoError(e.message || 'This photograph could not be used. Please choose another one.');
    } finally {
      setPhotoBusy(false);
    }
  }, [clear]);

  const handlePhotoAdjust = useCallback((patch) => {
    setPhoto((prev) => {
      if (!prev || !sourceRef.current) return prev;
      const next = { ...prev, ...patch };
      next.cropUrl = cropToFrame(sourceRef.current, { zoom: next.zoom, focusX: next.focusX, focusY: next.focusY });
      return next;
    });
  }, []);

  const handlePhotoRemove = useCallback(() => {
    sourceRef.current = null;
    setPhoto(null);
    setPhotoError('');
    clear();
  }, [clear]);

  const handleDownload = useCallback(async () => {
    setShowAll(true);
    const problems = validateForm(form, Boolean(photo), brand.features, brand.region);
    const keys = Object.keys(problems);
    if (keys.length > 0) {
      const idFor = { photo: 'photo-input' };
      const el = document.getElementById(idFor[keys[0]] || keys[0]);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        try { el.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      }
      return;
    }
    await generate(buildFilename(data.name));
  }, [form, photo, data.name, generate]);

  const handleReset = useCallback(() => {
    if (!window.confirm('Clear the form and remove your photograph?')) return;
    setForm(makeInitialForm());
    mottoChosenByUser.current = false;
    sourceRef.current = null;
    setPhoto(null);
    setPhotoError('');
    setTouched({});
    setShowAll(false);
    clear();
  }, [clear]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    try { await shareImage(result.blob, result.filename); } catch (e) { /* user cancelled */ }
  }, [result]);

  useEffect(() => {
    setCanShare(result ? canShareImage(result.blob, result.filename) : false);
  }, [result]);

  // privacy: drop the temporary image data when the page is left
  useEffect(() => {
    const onLeave = () => { sourceRef.current = null; clear(); };
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, [clear]);

  const photoUrl = photo ? photo.cropUrl : null;

  return (
    <div className="min-h-screen">
      <Header />

      <main id="create" className="mx-auto max-w-6xl px-4 py-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        <section aria-labelledby="form-title" className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 id="form-title" className="text-xl font-bold text-deep">Your details</h2>
            <a href="#preview" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-secondary lg:hidden">
              <Eye className="h-4 w-4" aria-hidden="true" /> See preview
            </a>
          </div>
          <MembershipForm
            form={form}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            photo={photo}
            photoBusy={photoBusy}
            onPhotoSelect={handlePhotoSelect}
            onPhotoRemove={handlePhotoRemove}
            onPhotoAdjust={handlePhotoAdjust}
          />
        </section>

        <section id="preview" aria-labelledby="preview-title" className="mt-6 space-y-4 lg:sticky lg:top-4 lg:mt-0">
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <h2 id="preview-title" className="mb-3 text-xl font-bold text-deep">Live preview</h2>
            <CardPreview data={data} photoUrl={photoUrl} />
            <p className="mt-3 text-xs text-slate-500">The card updates as you type. The downloaded image is 1600 × 1008 pixels.</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <DownloadButton
              status={status}
              error={error}
              result={result}
              canShare={canShare}
              onDownload={handleDownload}
              onReset={handleReset}
              onShare={handleShare}
            />
          </div>
        </section>
      </main>

      <Footer />

      {/* hidden, full-size copy of the card: this is what is turned into the PNG */}
      <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}>
        <MembershipCard ref={exportRef} data={data} photoUrl={photoUrl} />
      </div>
    </div>
  );
}
