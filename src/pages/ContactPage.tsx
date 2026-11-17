import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { OFFICES, UPCOMING_OFFICE_NOTICE } from '../data/company';
import { getProductBySlug, PRODUCTS } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EnquiryFormPanel } from '../components/EnquiryFormPanel';
import { useLocation } from 'react-router-dom';
import { SplitText } from '../components/motion/SplitText';
import { SocialFlipButton } from '../components/ui/SocialFlipButton';

export function ContactPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const rfqPrefill = searchParams.get('from') === 'rfq' ? (location.state as { prefill?: { gradeLabel?: string; sizingAndPacking?: string; message?: string } } | null)?.prefill : undefined;
  const urlTab = searchParams.get('tab') === 'general' ? 'general' : 'quote';
  const urlProduct = searchParams.get('product');

  const initialProductSlug = useMemo(() => {
    if (urlProduct && getProductBySlug(urlProduct)) return urlProduct;
    return PRODUCTS[0].slug;
  }, [urlProduct]);

  const handleTabChange = (next: 'quote' | 'general') => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', next);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Contact & Quotation' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            Commercial & Office Directory
          </p>
          <SplitText
            text="Product quotations & commercial enquiries."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
          />
          <p className="text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
            Configure an alloy quotation request with your preferred grade, sizing, and packaging requirements, or reach Berry Alloys Limited’s offices in Kolkata, Visakhapatnam, and Dhalbhumgarh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Interactive Quotation / General Form */}
          <div className="lg:col-span-7">
            <EnquiryFormPanel
              selectedProductSlug={initialProductSlug}
              prefill={rfqPrefill}
              initialTab={urlTab}
              onTabChange={handleTabChange}
              idPrefix="contact"
              variant="auto"
            />
          </div>

          {/* Sourced Office Directory */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-[#10243A] text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/14 p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#69C5F5] mb-1">
                  Published Office Contacts
                </p>
                <h2 className="font-display text-3xl font-bold uppercase">
                  Berry Alloys Limited Locations
                </h2>
              </div>

              <div className="divide-y divide-[#F4F8FC]/12">
                {OFFICES.map((office) => (
                  <div key={office.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                    <h3 className="font-display text-xl font-bold uppercase text-[#F4F8FC]">
                      {office.label}
                    </h3>
                    <p className="text-xs text-[#B5C5D7] leading-relaxed flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#69C5F5] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{office.address}</span>
                    </p>
                    <p className="text-xs font-mono-tabular text-[#F4F8FC]/85 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#69C5F5] shrink-0" aria-hidden="true" />
                      <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="hover:underline">
                        {office.phone}
                      </a>
                    </p>
                    <p className="text-xs font-mono-tabular text-[#F4F8FC]/85 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#69C5F5] shrink-0" aria-hidden="true" />
                      <a href={`mailto:${office.email}`} className="hover:underline">
                        {office.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-6 space-y-2 text-xs text-[#10243A] dark:text-[#F4F8FC]">
              <h3 className="font-display text-lg font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                {UPCOMING_OFFICE_NOTICE.title}
              </h3>
              <p className="font-medium text-[#10243A] dark:text-[#F4F8FC]">
                {UPCOMING_OFFICE_NOTICE.address}
              </p>
              <p className="leading-relaxed text-[#465C72] dark:text-[#B5C5D7]">
                {UPCOMING_OFFICE_NOTICE.note}
              </p>
            </div>

            <div className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-6">
              <SocialFlipButton heading="Direct & Social Channels" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
