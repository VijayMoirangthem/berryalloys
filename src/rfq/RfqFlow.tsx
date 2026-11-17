import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, Download, FileText, MessageCircle, Pencil, RotateCcw } from 'lucide-react';
import { DICTIONARIES, RFQ_COUNTRY_CODES, countryName, fmt } from '../i18n';
import type { LocaleCode } from '../i18n/locales';
import { cn } from '../lib/utils';
import { Ltr } from '../components/localized/Ltr';
import { PRODUCTS } from '../data/products';
import { useRfq } from './RfqContext';
import {
  DELIVERY_IDS,
  FAMILY_LABELS,
  FAMILY_ORDER,
  PACKAGING_IDS,
  RFQ_STEPS,
  SIZING_IDS,
  UNIT_IDS,
  buildSummaryRows,
  buildSummaryText,
  gradesForProduct,
  productName,
  productsForFamily,
  toEnquiryPrefill,
  validEmail,
  validateAll,
  validateStep,
} from './rfq';

interface RfqFlowProps {
  lang: LocaleCode;
  /** Compact layout for the Berry Compass panel. */
  compact?: boolean;
  onAskQuestion?: () => void;
}

const inputCls =
  'w-full min-h-[44px] border border-control bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none';
const chip = (active: boolean) =>
  cn(
    'min-h-[44px] border px-3 py-2 text-start text-sm font-medium transition-colors cursor-pointer',
    active ? 'border-brand bg-brand text-on-brand' : 'border-control bg-card text-ink hover:border-brand'
  );

export function RfqFlow({ lang, compact, onAskQuestion }: RfqFlowProps) {
  const t = DICTIONARIES[lang];
  const L = t.rfq;
  const { draft, patch, contact, setContact, step, setStep, reset } = useRfq();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [editingFrom, setEditingFrom] = useState(false);

  const onReview = step >= RFQ_STEPS - 1 || reviewing;
  const summaryRows = useMemo(() => buildSummaryRows(draft, lang), [draft, lang]);
  const problems = useMemo(() => validateAll(draft, t), [draft, t]);
  const grades = gradesForProduct(draft.productSlug);

  const goNext = () => {
    const m = validateStep(step, draft, t);
    if (m) return setError(m);
    setError(null);
    if (editingFrom) {
      setEditingFrom(false);
      setStep(RFQ_STEPS - 1);
      return;
    }
    setStep(Math.min(RFQ_STEPS - 1, step + 1));
  };
  const goBack = () => {
    setError(null);
    setStep(Math.max(0, step - 1));
  };
  const editStep = (n: number) => {
    setError(null);
    setEditingFrom(true);
    setStep(n);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText(draft, contact, lang));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Copy is not available in this browser.');
    }
  };
  const download = () => {
    const blob = new Blob([buildSummaryText(draft, contact, lang)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `berry-alloys-rfq-summary-${lang}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const continueForm = () => {
    const prefill = toEnquiryPrefill(draft, lang);
    navigate(`/contact?tab=quote&product=${encodeURIComponent(draft.productSlug)}&from=rfq`, { state: { prefill } });
  };

  const field = (label: string, node: React.ReactNode, hint?: string, id?: string) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-ink-2" htmlFor={id}>
        {label}
      </label>
      {node}
      {hint && <p className="text-[11px] text-ink-muted">{hint}</p>}
    </div>
  );

  const stepBody = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label={L.stepTitles[0]}>
              {FAMILY_ORDER.map((f) => (
                <button key={f} type="button" aria-pressed={draft.family === f} onClick={() => patch({ family: f, productSlug: '', grade: '' })} className={chip(draft.family === f)}>
                  {FAMILY_LABELS[lang][f]}
                </button>
              ))}
            </div>
            {field(
              L.productLabel,
              <select
                id="rfq-product"
                className={inputCls}
                value={draft.productSlug}
                onChange={(e) => {
                  const p = PRODUCTS.find((x) => x.slug === e.target.value);
                  patch({ productSlug: e.target.value, family: p?.family ?? draft.family, grade: '' });
                }}
              >
                <option value="">—</option>
                {productsForFamily(draft.family).map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {productName(p.slug, lang)} ({p.shortName})
                  </option>
                ))}
              </select>,
              undefined,
              'rfq-product'
            )}
            {grades.length > 0 &&
              field(
                t.product.columns.grade,
                <select id="rfq-grade" className={inputCls} value={draft.grade} onChange={(e) => patch({ grade: e.target.value })}>
                  <option value="">—</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>,
                undefined,
                'rfq-grade'
              )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2" role="group" aria-label={L.stepTitles[1]}>
              {SIZING_IDS.map((id) => (
                <button key={id} type="button" aria-pressed={draft.sizing === id} onClick={() => patch({ sizing: id })} className={chip(draft.sizing === id)}>
                  {L.sizing[id]}
                </button>
              ))}
            </div>
            {field(L.sizeNote, <input id="rfq-sizenote" className={inputCls} value={draft.sizeNote} onChange={(e) => patch({ sizeNote: e.target.value })} />, undefined, 'rfq-sizenote')}
            <p className="text-[11px] text-ink-muted">{L.requirementNote}</p>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            {field(
              L.quantity,
              <input id="rfq-qty" inputMode="decimal" dir="ltr" className={cn(inputCls, 'text-start')} value={draft.quantity} onChange={(e) => patch({ quantity: e.target.value })} />,
              undefined,
              'rfq-qty'
            )}
            {field(
              L.unit,
              <select id="rfq-unit" className={inputCls} value={draft.unit} onChange={(e) => patch({ unit: e.target.value as typeof draft.unit })}>
                {UNIT_IDS.map((u) => (
                  <option key={u} value={u}>
                    {L.units[u]}
                  </option>
                ))}
              </select>,
              undefined,
              'rfq-unit'
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2" role="group" aria-label={L.stepTitles[3]}>
              {PACKAGING_IDS.map((id) => (
                <button key={id} type="button" aria-pressed={draft.packaging === id} onClick={() => patch({ packaging: id })} className={chip(draft.packaging === id)}>
                  {L.packaging[id]}
                </button>
              ))}
            </div>
            {draft.packaging === 'other' &&
              field(L.packagingOther, <input id="rfq-packother" className={inputCls} value={draft.packagingOther} onChange={(e) => patch({ packagingOther: e.target.value })} />, undefined, 'rfq-packother')}
            <p className="text-[11px] text-ink-muted">{L.requirementNote}</p>
          </div>
        );
      case 4: {
        const countries = [...RFQ_COUNTRY_CODES].map((c) => ({ c, n: countryName(c, lang) })).sort((a, b) => a.n.localeCompare(b.n, lang));
        return (
          <div className="space-y-4">
            {field(
              L.country,
              <select id="rfq-country" className={inputCls} value={draft.country} onChange={(e) => patch({ country: e.target.value })}>
                <option value="">{L.selectCountry}</option>
                {countries.map((x) => (
                  <option key={x.c} value={x.c}>
                    {x.n}
                  </option>
                ))}
                <option value="OTHER">{L.otherCountry}</option>
              </select>,
              undefined,
              'rfq-country'
            )}
            {draft.country === 'OTHER' && field(L.otherCountryName, <input id="rfq-othercountry" className={inputCls} value={draft.otherCountry} onChange={(e) => patch({ otherCountry: e.target.value })} />, undefined, 'rfq-othercountry')}
            {field(L.port, <input id="rfq-port" className={inputCls} value={draft.port} onChange={(e) => patch({ port: e.target.value })} />, undefined, 'rfq-port')}
          </div>
        );
      }
      case 5:
        return (
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={L.stepTitles[5]}>
            {DELIVERY_IDS.map((id) => (
              <button key={id} type="button" aria-pressed={draft.delivery === id} onClick={() => patch({ delivery: id })} className={chip(draft.delivery === id)}>
                {L.deliveryOptions[id]}
              </button>
            ))}
          </div>
        );
      case 6:
        return field(
          L.notes,
          <textarea id="rfq-notes" rows={compact ? 4 : 5} className={cn(inputCls, 'resize-y')} value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} />,
          L.notesHint,
          'rfq-notes'
        );
      default:
        return null;
    }
  };

  const reviewBody = (
    <div className="space-y-4">
      <p className="text-xs text-ink-2">{L.englishLabelsNote}</p>
      <dl className="divide-y divide-subtle border border-subtle bg-card">
        {summaryRows.map((r) => (
          <div key={r.key} className="flex items-start justify-between gap-3 p-3">
            <div className="min-w-0">
              <dt className="text-[11px] font-semibold text-ink-muted">
                {r.labelLocal}
                {lang !== 'en' && <span className="ms-2 font-normal" dir="ltr">· {r.labelEn}</span>}
              </dt>
              <dd className="mt-0.5 text-sm text-ink break-words" dir="auto">
                {r.key === 'quantity' || r.key === 'product' ? <Ltr>{r.valueLocal}</Ltr> : r.valueLocal}
              </dd>
            </div>
            <button type="button" onClick={() => editStep(r.step)} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer min-h-[32px]">
              <Pencil className="h-3 w-3" aria-hidden="true" />
              {L.edit}
            </button>
          </div>
        ))}
      </dl>
      <p className="text-[11px] text-ink-muted">{L.originalNotesNote}</p>

      <fieldset className="space-y-3 border border-subtle bg-band p-3">
        <legend className="px-1 text-xs font-semibold text-ink">{L.contactTitle}</legend>
        <p className="text-[11px] text-ink-muted">{L.contactNotice}</p>
        <div className={cn('grid gap-3', compact ? 'grid-cols-1' : 'sm:grid-cols-3')}>
          {field(L.name, <input id="rfq-name" autoComplete="off" className={inputCls} value={contact.name} onChange={(e) => setContact({ name: e.target.value })} />, undefined, 'rfq-name')}
          {field(L.company, <input id="rfq-company" autoComplete="off" className={inputCls} value={contact.company} onChange={(e) => setContact({ company: e.target.value })} />, undefined, 'rfq-company')}
          {field(L.email, <input id="rfq-email" type="email" dir="ltr" autoComplete="off" className={cn(inputCls, 'text-start')} value={contact.email} onChange={(e) => setContact({ email: e.target.value })} />, undefined, 'rfq-email')}
        </div>
      </fieldset>

      <p className="border-s-4 border-brand bg-brand-soft p-3 text-xs text-ink">{L.commercial}</p>
      <p role="status" className="border-s-4 border-accent-red bg-accent-red-soft p-3 text-xs font-semibold text-ink">
        {L.notSent}
      </p>

      {problems.length > 0 && (
        <ul className="space-y-1 text-xs text-danger" role="alert">
          {problems.map((p) => (
            <li key={p.step}>
              <button type="button" className="underline cursor-pointer" onClick={() => editStep(p.step)}>
                {p.message}
              </button>
            </li>
          ))}
        </ul>
      )}
      {!validEmail(contact.email) && <p className="text-xs text-danger" role="alert">{L.errors.email}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} className="inline-flex min-h-[44px] items-center gap-2 border border-control bg-card px-4 text-xs font-semibold text-ink hover:border-brand cursor-pointer">
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? L.copied : L.copy}
        </button>
        <button type="button" onClick={download} className="inline-flex min-h-[44px] items-center gap-2 border border-control bg-card px-4 text-xs font-semibold text-ink hover:border-brand cursor-pointer">
          <Download className="h-4 w-4" aria-hidden="true" />
          {L.download}
        </button>
        <button
          type="button"
          onClick={continueForm}
          disabled={problems.length > 0 || !validEmail(contact.email)}
          className="inline-flex min-h-[44px] items-center gap-2 bg-brand px-4 text-xs font-semibold text-on-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          {L.continueForm}
        </button>
        <button type="button" onClick={() => { reset(); setReviewing(false); }} className="inline-flex min-h-[44px] items-center gap-2 px-3 text-xs font-semibold text-ink-2 hover:text-ink cursor-pointer">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {L.startOver}
        </button>
      </div>
    </div>
  );

  return (
    <section aria-labelledby="rfq-heading" className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold text-ink-muted" aria-live="polite">
            {fmt(L.progress, { n: step + 1, total: RFQ_STEPS })}
          </p>
          {onAskQuestion && (
            <button type="button" onClick={onAskQuestion} className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer">
              <MessageCircle className="h-3 w-3" aria-hidden="true" />
              {L.askQuestion}
            </button>
          )}
        </div>
        <div className="h-1 bg-subtle" role="progressbar" aria-valuemin={1} aria-valuemax={RFQ_STEPS} aria-valuenow={step + 1}>
          <div className="h-full bg-brand transition-all duration-300" style={{ width: `${((step + 1) / RFQ_STEPS) * 100}%` }} />
        </div>
        <h3 id="rfq-heading" className="pt-1 text-lg font-bold text-ink">
          {L.stepTitles[step]}
        </h3>
      </div>

      {onReview ? reviewBody : stepBody()}

      {error && (
        <p role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p>
      )}

      {!onReview && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <button type="button" data-rfq="back" onClick={goBack} disabled={step === 0} className="inline-flex min-h-[44px] items-center gap-2 border border-control px-4 text-sm font-semibold text-ink hover:border-brand disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {L.back}
          </button>
          <button type="button" data-rfq="next" onClick={goNext} className="inline-flex min-h-[44px] items-center gap-2 bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand-hover cursor-pointer">
            {step === RFQ_STEPS - 2 ? L.review : L.next}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      )}
      {onReview && step === RFQ_STEPS - 1 && (
        <button type="button" onClick={() => setStep(RFQ_STEPS - 2)} className="inline-flex min-h-[36px] items-center gap-2 text-xs font-semibold text-ink-2 hover:text-ink cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {L.back}
        </button>
      )}
    </section>
  );
}
