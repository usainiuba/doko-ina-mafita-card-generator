import { Lock } from 'lucide-react';
import { brand } from '../config/brand.js';
import { STATES } from '../config/states.js';
import { LGAS, OTHER_LGA } from '../config/lgas.js';
import { POSITIONS } from '../config/positions.js';
import { MOTTOS, CUSTOM_MOTTO_ID } from '../config/mottos.js';
import { findPosition } from '../utils/cardData.js';
import SearchableSelect from './SearchableSelect.jsx';
import PhotoUpload from './PhotoUpload.jsx';

const inputCls = (invalid) =>
  `w-full min-h-[48px] rounded-xl border bg-white px-4 text-base focus:outline-none focus:ring-2 focus:ring-secondary ${invalid ? 'border-red-500' : 'border-slate-300'}`;

function Field({ id, label, required, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-deep">
        {label}
        {required && <span className="text-red-600" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

const describe = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export default function MembershipForm({ form, errors, onChange, onBlur, photo, photoBusy, onPhotoSelect, onPhotoRemove, onPhotoAdjust }) {
  const { region, features } = brand;
  const position = findPosition(form.positionId);

  const lgaList = LGAS[form.stateName] || [];
  const lgaOptions = lgaList.map((n) => ({ value: n, label: n }));
  if (region.allowManualLga && form.stateName) lgaOptions.push({ value: OTHER_LGA, label: 'Other (type manually)' });

  const positionOptions = POSITIONS.map((p) => ({ value: p.id, label: p.label }));

  return (
    <div className="space-y-5">
      {/* 1. Name */}
      <Field id="fullName" label="Full name" required error={errors.fullName} hint="Exactly as you want it printed on the card.">
        <input
          id="fullName" type="text" autoComplete="name" maxLength={60} value={form.fullName}
          onChange={(e) => onChange('fullName', e.target.value)} onBlur={() => onBlur('fullName')}
          aria-invalid={Boolean(errors.fullName) || undefined} aria-describedby={describe('fullName', errors.fullName, true)}
          placeholder="e.g. Usaini Uba" className={inputCls(errors.fullName)}
        />
      </Field>

      {/* 2. Photo */}
      <Field id="photo-input" label="Profile photograph" required={features.requirePhoto}>
        <PhotoUpload photo={photo} busy={photoBusy} error={errors.photo} onSelect={onPhotoSelect} onRemove={onPhotoRemove} onAdjust={onPhotoAdjust} />
        <p className="text-xs text-slate-500">Your photo stays on your phone. It is never uploaded.</p>
      </Field>

      {/* 3. State */}
      <Field id="stateName" label="State of residence" required error={errors.stateName}>
        {region.lockedState ? (
          <div className="relative">
            <input
              id="stateName" type="text" readOnly aria-readonly="true" value={region.lockedState}
              className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-slate-100 px-4 pr-11 text-base text-slate-700"
            />
            <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          </div>
        ) : (
          <select
            id="stateName" value={form.stateName} onChange={(e) => onChange('stateName', e.target.value)} onBlur={() => onBlur('stateName')}
            aria-invalid={Boolean(errors.stateName) || undefined} className={inputCls(errors.stateName)}
          >
            <option value="">Select your State</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </Field>

      {/* 4. LGA */}
      <Field id="lga" label="Local Government Area" required error={errors.lga}>
        <SearchableSelect
          id="lga" options={lgaOptions} value={form.lga} disabled={!form.stateName}
          placeholder={form.stateName ? 'Select or search your LGA' : 'Select a State first'}
          onChange={(v) => onChange('lga', v)} onBlur={() => onBlur('lga')}
          invalid={Boolean(errors.lga)} describedBy={describe('lga', errors.lga, false)}
        />
        {region.allowManualLga && form.lga === OTHER_LGA && (
          <input
            type="text" maxLength={60} value={form.lgaManual} onChange={(e) => onChange('lgaManual', e.target.value)} onBlur={() => onBlur('lga')}
            placeholder="Type your Local Government Area" aria-label="Type your Local Government Area" className={`mt-2 ${inputCls(errors.lga)}`}
          />
        )}
      </Field>

      {/* 5. Ward */}
      <Field id="ward" label="Ward" required error={errors.ward}>
        <input
          id="ward" type="text" maxLength={60} value={form.ward} onChange={(e) => onChange('ward', e.target.value)} onBlur={() => onBlur('ward')}
          aria-invalid={Boolean(errors.ward) || undefined} aria-describedby={describe('ward', errors.ward, false)}
          placeholder="Type your ward" className={inputCls(errors.ward)}
        />
      </Field>

      {/* 6. Position */}
      <Field id="positionId" label="Position / membership category" required error={errors.positionId}>
        <SearchableSelect
          id="positionId" options={positionOptions} value={form.positionId} placeholder="Select or search your position"
          onChange={(v) => onChange('positionId', v)} onBlur={() => onBlur('positionId')}
          invalid={Boolean(errors.positionId)} describedBy={describe('positionId', errors.positionId, false)}
        />
      </Field>

      {position && position.custom && (
        <Field id="customPosition" label="Your position" required error={errors.customPosition}>
          <input
            id="customPosition" type="text" maxLength={50} value={form.customPosition}
            onChange={(e) => onChange('customPosition', e.target.value)} onBlur={() => onBlur('customPosition')}
            aria-invalid={Boolean(errors.customPosition) || undefined} aria-describedby={describe('customPosition', errors.customPosition, false)}
            placeholder="Type your position" className={inputCls(errors.customPosition)}
          />
        </Field>
      )}

      {/* 7. Footer message */}
      <fieldset className="space-y-2">
        <legend className="mb-1 block text-sm font-semibold text-deep">Message at the bottom of the card</legend>
        {MOTTOS.map((m) => (
          <label key={m.id} className={`flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${form.mottoId === m.id ? 'border-secondary bg-emerald-50' : 'border-slate-300 bg-white'}`}>
            <input type="radio" name="motto" value={m.id} checked={form.mottoId === m.id} onChange={() => onChange('mottoId', m.id)} className="mt-1 h-5 w-5 accent-[var(--dim-secondary)]" />
            <span>
              <span className="block text-base font-semibold text-deep">{m.text}</span>
              <span className="block text-xs text-slate-500">{m.hint}</span>
            </span>
          </label>
        ))}
        {features.allowCustomFooter && (
          <>
            <label className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${form.mottoId === CUSTOM_MOTTO_ID ? 'border-secondary bg-emerald-50' : 'border-slate-300 bg-white'}`}>
              <input type="radio" name="motto" value={CUSTOM_MOTTO_ID} checked={form.mottoId === CUSTOM_MOTTO_ID} onChange={() => onChange('mottoId', CUSTOM_MOTTO_ID)} className="h-5 w-5 accent-[var(--dim-secondary)]" />
              <span className="text-base font-semibold text-deep">My own message</span>
            </label>
            {form.mottoId === CUSTOM_MOTTO_ID && (
              <Field id="customFooter" label="Your footer message" error={errors.customFooter}>
                <input
                  id="customFooter" type="text" maxLength={80} value={form.customFooter}
                  onChange={(e) => onChange('customFooter', e.target.value)} onBlur={() => onBlur('customFooter')}
                  aria-invalid={Boolean(errors.customFooter) || undefined} className={inputCls(errors.customFooter)}
                />
              </Field>
            )}
          </>
        )}
      </fieldset>

      {/* 8. Optional membership number (only when enabled by the administrator) */}
      {features.showMembershipNumber && (
        <Field id="membershipNumber" label="Membership number (optional)" error={errors.membershipNumber} hint="Only enter a number given to you by an authorised administrator.">
          <input
            id="membershipNumber" type="text" maxLength={30} value={form.membershipNumber}
            onChange={(e) => onChange('membershipNumber', e.target.value)} onBlur={() => onBlur('membershipNumber')}
            aria-invalid={Boolean(errors.membershipNumber) || undefined} className={inputCls(errors.membershipNumber)}
          />
        </Field>
      )}
    </div>
  );
}
