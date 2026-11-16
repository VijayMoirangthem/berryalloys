import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { getProductBySlug, PRODUCTS } from '../data/products';
import { IndustrialButton } from './ui/IndustrialButton';

export interface EnquiryPayload {
  tab: 'quote' | 'general';
  name: string;
  email: string;
  phone: string;
  company: string;
  productSlug: string;
  gradeLabel: string;
  sizingAndPacking: string;
  subject: string;
  message: string;
}

interface EnquiryFormPanelProps {
  selectedProductSlug?: string;
  onProductChange?: (slug: string) => void;
  initialTab?: 'quote' | 'general';
  onTabChange?: (next: 'quote' | 'general') => void;
  idPrefix?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export function EnquiryFormPanel({
  selectedProductSlug,
  onProductChange,
  initialTab = 'quote',
  onTabChange,
  idPrefix = 'enquiry',
  variant = 'auto',
}: EnquiryFormPanelProps) {
  const [tab, setTab] = useState<'quote' | 'general'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [productSlug, setProductSlug] = useState(
    selectedProductSlug && getProductBySlug(selectedProductSlug)
      ? selectedProductSlug
      : PRODUCTS[0].slug
  );
  const [gradeLabel, setGradeLabel] = useState('');
  const [sizingAndPacking, setSizingAndPacking] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedReceipt, setSubmittedReceipt] = useState<EnquiryPayload | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (selectedProductSlug && getProductBySlug(selectedProductSlug)) {
      setProductSlug(selectedProductSlug);
      setGradeLabel('');
      setTab('quote');
      setSubmittedReceipt(null);
    }
  }, [selectedProductSlug]);

  const selectedProduct = useMemo(
    () => getProductBySlug(productSlug) ?? PRODUCTS[0],
    [productSlug]
  );

  const availableGrades = useMemo(() => {
    const grades: string[] = [];
    selectedProduct.tables.forEach((t) => {
      t.rows.forEach((r) => {
        const label = `${r.category ?? ''} ${r.grade ?? ''}`.trim();
        if (label && !grades.includes(label)) {
          grades.push(label);
        }
      });
    });
    return grades;
  }, [selectedProduct]);

  const switchTab = (next: 'quote' | 'general') => {
    setTab(next);
    setSubmittedReceipt(null);
    setErrors({});
    onTabChange?.(next);
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid business email address.';
    }
    if (!/^[+]?[\d\s()-]{8,16}$/.test(phone.trim())) {
      nextErrors.phone = 'Please enter a valid 8–16 digit phone or mobile number.';
    }
    if (tab === 'general' && !subject.trim()) {
      nextErrors.subject = 'Please specify a subject for your enquiry.';
    }
    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = 'Please enter a brief message (at least 10 characters).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmittedReceipt({
      tab,
      name,
      email,
      phone,
      company,
      productSlug,
      gradeLabel: gradeLabel || availableGrades[0] || 'Standard',
      sizingAndPacking,
      subject,
      message,
    });
  };

  const isForcedDark = variant === 'dark';

  const cardSurface = isForcedDark
    ? 'bg-[#1B1E21] border border-[#F3F0E9]/14 text-[#F3F0E9]'
    : 'bg-white border border-[#141618]/15 text-[#141618] dark:bg-[#20242A] dark:border-[#F3F0E9]/16 dark:text-[#F3F0E9]';

  const labelClass = isForcedDark
    ? 'block text-xs font-semibold text-[#F3F0E9] mb-1.5'
    : 'block text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] mb-1.5';

  const inputClass = isForcedDark
    ? 'w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#141618] border border-[#F3F0E9]/20 text-[#F3F0E9] placeholder:text-[#A1A7AB]/70 focus:border-[#EC743C] focus:outline-none'
    : 'w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#F6F4EF] border border-[#141618]/20 text-[#141618] placeholder:text-[#4A5054]/70 focus:border-[#9E4B28] focus:outline-none dark:bg-[#121417] dark:border-[#F3F0E9]/20 dark:text-[#F3F0E9] dark:placeholder:text-[#A1A7AB]/70 dark:focus:border-[#EC743C]';

  const selectClass = isForcedDark
    ? 'w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#1B1E21] border border-[#F3F0E9]/20 text-[#F3F0E9] focus:border-[#EC743C] focus:outline-none'
    : 'w-full min-h-[44px] px-3 py-2.5 text-sm bg-white border border-[#141618]/20 text-[#141618] focus:border-[#9E4B28] focus:outline-none dark:bg-[#121417] dark:border-[#F3F0E9]/20 dark:text-[#F3F0E9] dark:focus:border-[#EC743C]';

  const errorTextClass = isForcedDark
    ? 'text-xs text-[#EC743C] mt-1'
    : 'text-xs text-[#9E4B28] dark:text-[#EC743C] mt-1';

  return (
    <div className={`${cardSurface} p-6 sm:p-8 space-y-6`}>
      <div
        role="tablist"
        aria-label="Enquiry type"
        className={`flex flex-wrap items-center gap-2 pb-4 border-b ${
          isForcedDark ? 'border-[#F3F0E9]/12' : 'border-[#141618]/12 dark:border-[#F3F0E9]/12'
        }`}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'quote'}
          onClick={() => switchTab('quote')}
          className={`min-h-[44px] px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            tab === 'quote'
              ? isForcedDark
                ? 'bg-[#A95632] text-[#F3F0E9]'
                : 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
              : isForcedDark
              ? 'bg-[#141618] text-[#A1A7AB] hover:text-[#F3F0E9]'
              : 'bg-[#ECE8DF] text-[#4A5054] hover:bg-[#D8D1C3] dark:bg-[#121417] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
          }`}
        >
          Product Quotation
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'general'}
          onClick={() => switchTab('general')}
          className={`min-h-[44px] px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            tab === 'general'
              ? isForcedDark
                ? 'bg-[#A95632] text-[#F3F0E9]'
                : 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
              : isForcedDark
              ? 'bg-[#141618] text-[#A1A7AB] hover:text-[#F3F0E9]'
              : 'bg-[#ECE8DF] text-[#4A5054] hover:bg-[#D8D1C3] dark:bg-[#121417] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
          }`}
        >
          General Enquiry
        </button>
      </div>

      <div
        className={`p-4 flex items-start gap-3 text-xs border ${
          isForcedDark
            ? 'bg-[#141618] border-[#F3F0E9]/14 text-[#F3F0E9]/85'
            : 'bg-[#ECE8DF] border-[#141618]/12 text-[#141618] dark:bg-[#121417] dark:border-[#F3F0E9]/14 dark:text-[#F3F0E9]/85'
        }`}
      >
        <Info
          className={`w-4 h-4 shrink-0 mt-0.5 ${
            isForcedDark ? 'text-[#EC743C]' : 'text-[#9E4B28] dark:text-[#EC743C]'
          }`}
          aria-hidden="true"
        />
        <p className="leading-relaxed">
          <strong>Prototype Demonstration Notice:</strong> Submitting this form validates your inputs locally and displays a preview confirmation. No email is dispatched and no personal or commercial data is stored.
        </p>
      </div>

      {submittedReceipt ? (
        <div role="status" className="py-4 space-y-5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className={`w-5 h-5 ${
                isForcedDark ? 'text-[#EC743C]' : 'text-[#9E4B28] dark:text-[#EC743C]'
              }`}
              aria-hidden="true"
            />
            <h3 className="font-display text-2xl font-bold uppercase">
              Demo {submittedReceipt.tab === 'quote' ? 'Quotation Request' : 'Enquiry'} Ready (Not Sent)
            </h3>
          </div>
          <p
            className={`text-sm leading-relaxed ${
              isForcedDark ? 'text-[#A1A7AB]' : 'text-[#4A5054] dark:text-[#A1A7AB]'
            }`}
          >
            All required fields were validated. In production, this payload routes to{' '}
            <span
              className={`font-mono-tabular ${
                isForcedDark ? 'text-[#F3F0E9]' : 'text-[#141618] dark:text-[#F3F0E9]'
              }`}
            >
              marketing@berryalloys.in
            </span>
            . No data has been transmitted or saved in this frontend prototype.
          </p>

          <dl
            className={`p-4 space-y-2 text-xs border ${
              isForcedDark
                ? 'bg-[#141618] border-[#F3F0E9]/12'
                : 'bg-[#F6F4EF] border-[#141618]/12 dark:bg-[#121417] dark:border-[#F3F0E9]/14'
            }`}
          >
            <div className="flex justify-between gap-4">
              <dt className={isForcedDark ? 'text-[#A1A7AB]' : 'text-[#4A5054] dark:text-[#A1A7AB]'}>
                Contact
              </dt>
              <dd className="font-medium text-right">
                {submittedReceipt.name} ({submittedReceipt.email})
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className={isForcedDark ? 'text-[#A1A7AB]' : 'text-[#4A5054] dark:text-[#A1A7AB]'}>
                Phone / Mobile
              </dt>
              <dd className="font-mono-tabular text-right">{submittedReceipt.phone}</dd>
            </div>
            {submittedReceipt.tab === 'quote' ? (
              <>
                <div className="flex justify-between gap-4">
                  <dt
                    className={
                      isForcedDark ? 'text-[#A1A7AB]' : 'text-[#4A5054] dark:text-[#A1A7AB]'
                    }
                  >
                    Selected Product
                  </dt>
                  <dd className="font-medium text-right">
                    {getProductBySlug(submittedReceipt.productSlug)?.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt
                    className={
                      isForcedDark ? 'text-[#A1A7AB]' : 'text-[#4A5054] dark:text-[#A1A7AB]'
                    }
                  >
                    Grade Reference
                  </dt>
                  <dd className="font-mono-tabular text-right">{submittedReceipt.gradeLabel}</dd>
                </div>
              </>
            ) : (
              <div className="flex justify-between gap-4">
                <dt className={isForcedDark ? 'text-[#A1A7AB]' : 'text-[#4A5054] dark:text-[#A1A7AB]'}>
                  Subject
                </dt>
                <dd className="font-medium text-right">{submittedReceipt.subject}</dd>
              </div>
            )}
          </dl>

          <IndustrialButton
            type="button"
            variant={isForcedDark ? 'outline-dark' : 'outline-light'}
            onClick={() => setSubmittedReceipt(null)}
          >
            Edit or Start Another Demo Request
          </IndustrialButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {tab === 'quote' && (
            <div
              className={`p-4 border space-y-4 ${
                isForcedDark
                  ? 'bg-[#141618] border-[#F3F0E9]/12'
                  : 'bg-[#F6F4EF] border-[#141618]/12 dark:bg-[#121417] dark:border-[#F3F0E9]/12'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${idPrefix}-product`} className={labelClass}>
                    Alloy Product
                  </label>
                  <select
                    id={`${idPrefix}-product`}
                    value={productSlug}
                    onChange={(e) => {
                      const nextSlug = e.target.value;
                      setProductSlug(nextSlug);
                      setGradeLabel('');
                      onProductChange?.(nextSlug);
                    }}
                    className={selectClass}
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`${idPrefix}-grade`} className={labelClass}>
                    Specific Grade / Variant
                  </label>
                  <select
                    id={`${idPrefix}-grade`}
                    value={gradeLabel || availableGrades[0] || ''}
                    onChange={(e) => setGradeLabel(e.target.value)}
                    className={selectClass}
                  >
                    {availableGrades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                    <option value="Custom Grade Specification">Custom Grade Specification</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={`${idPrefix}-sizing`} className={labelClass}>
                  Lump Sizing, Packing & Estimated Tonnage (Optional)
                </label>
                <input
                  id={`${idPrefix}-sizing`}
                  type="text"
                  value={sizingAndPacking}
                  onChange={(e) => setSizingAndPacking(e.target.value)}
                  placeholder="e.g., 10–50 mm, 1 MT jumbo bags, Visakhapatnam FOB / domestic"
                  className={isForcedDark ? inputClass : selectClass}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${idPrefix}-name`} className={labelClass}>
                Your Name *
              </label>
              <input
                id={`${idPrefix}-name`}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
              />
              {errors.name && (
                <p role="alert" className={errorTextClass}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${idPrefix}-company`} className={labelClass}>
                Steel Mill / Organisation
              </label>
              <input
                id={`${idPrefix}-company`}
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${idPrefix}-email`} className={labelClass}>
                Email Address *
              </label>
              <input
                id={`${idPrefix}-email`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={inputClass}
              />
              {errors.email && (
                <p role="alert" className={errorTextClass}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${idPrefix}-phone`} className={labelClass}>
                Phone / Mobile *
              </label>
              <input
                id={`${idPrefix}-phone`}
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                placeholder="+91 ..."
                className={inputClass}
              />
              {errors.phone && (
                <p role="alert" className={errorTextClass}>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {tab === 'general' && (
            <div>
              <label htmlFor={`${idPrefix}-subject`} className={labelClass}>
                Subject *
              </label>
              <input
                id={`${idPrefix}-subject`}
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                aria-invalid={Boolean(errors.subject)}
                className={inputClass}
              />
              {errors.subject && (
                <p role="alert" className={errorTextClass}>
                  {errors.subject}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor={`${idPrefix}-message`} className={labelClass}>
              {tab === 'quote'
                ? 'Chemistry Tolerances, Delivery Schedule & Message *'
                : 'Message *'}
            </label>
            <textarea
              id={`${idPrefix}-message`}
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={Boolean(errors.message)}
              className={inputClass}
            />
            {errors.message && (
              <p role="alert" className={errorTextClass}>
                {errors.message}
              </p>
            )}
          </div>

          <IndustrialButton type="submit" variant="primary">
            {tab === 'quote'
              ? 'Preview Demo Quotation Request'
              : 'Preview Demo General Enquiry'}
          </IndustrialButton>
        </form>
      )}
    </div>
  );
}
