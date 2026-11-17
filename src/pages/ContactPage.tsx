import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { OFFICES, UPCOMING_OFFICE_NOTICE } from '../data/company';
import { getProductBySlug, PRODUCTS } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EnquiryFormPanel } from '../components/EnquiryFormPanel';
import { SplitText } from '../components/motion/SplitText';
import { SocialFlipButton } from '../components/ui/SocialFlipButton';

export function ContactPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Contact & Quotation' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Commercial & Office Directory
          </p>
          <SplitText
            text="Product quotations & commercial enquiries."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
          />
          <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
            Configure an alloy quotation request with your preferred grade, sizing, and packaging requirements, or reach Berry Alloys Limited’s offices in Kolkata, Visakhapatnam, and Dhalbhumgarh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Interactive Quotation / General Form */}
          <div className="lg:col-span-7">
            <EnquiryFormPanel
              selectedProductSlug={initialProductSlug}
              initialTab={urlTab}
              onTabChange={handleTabChange}
              idPrefix="contact"
              variant="auto"
            />
          </div>

          {/* Sourced Office Directory */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-[#141618] text-[#F3F0E9] border border-[#141618] dark:border-[#F3F0E9]/14 p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#EC743C] mb-1">
                  Published Office Contacts
                </p>
                <h2 className="font-display text-3xl font-bold uppercase">
                  Berry Alloys Limited Locations
                </h2>
              </div>

              <div className="divide-y divide-[#F3F0E9]/12">
                {OFFICES.map((office) => (
                  <div key={office.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                    <h3 className="font-display text-xl font-bold uppercase text-[#F3F0E9]">
                      {office.label}
                    </h3>
                    <p className="text-xs text-[#A1A7AB] leading-relaxed flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#EC743C] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{office.address}</span>
                    </p>
                    <p className="text-xs font-mono-tabular text-[#F3F0E9]/85 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#EC743C] shrink-0" aria-hidden="true" />
                      <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="hover:underline">
                        {office.phone}
                      </a>
                    </p>
                    <p className="text-xs font-mono-tabular text-[#F3F0E9]/85 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#EC743C] shrink-0" aria-hidden="true" />
                      <a href={`mailto:${office.email}`} className="hover:underline">
                        {office.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-6 space-y-2 text-xs text-[#141618] dark:text-[#F3F0E9]">
              <h3 className="font-display text-lg font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                {UPCOMING_OFFICE_NOTICE.title}
              </h3>
              <p className="font-medium text-[#141618] dark:text-[#F3F0E9]">
                {UPCOMING_OFFICE_NOTICE.address}
              </p>
              <p className="leading-relaxed text-[#4A5054] dark:text-[#A1A7AB]">
                {UPCOMING_OFFICE_NOTICE.note}
              </p>
            </div>

            <div className="bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-6">
              <SocialFlipButton heading="Direct & Social Channels" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
