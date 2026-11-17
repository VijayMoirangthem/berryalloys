import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, FileText } from 'lucide-react';
import { CORPORATE_DOCUMENT_GROUPS, CorporateDocGroup } from '../data/communityNewsCareersDocs';
import { COMPANY_INFO } from '../data/company';
import { BERRY_COMPENDIUM_BOOKS } from '../data/showcaseCollections';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { SplitText } from '../components/motion/SplitText';
import { BookCfg, BooksShowcase } from '../components/ui/BooksShowcase';

type DocTypeFilter = 'All' | CorporateDocGroup['type'];

export function DocumentsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<DocTypeFilter>('All');

  const handleBookPrimary = (book: BookCfg) => {
    if (book.id === 'mgt-7-statutory') {
      setFilter('Annual Returns (Form MGT-7)');
      document.getElementById('doc-directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (book.targetRoute) {
      navigate(book.targetRoute);
    }
  };

  const handleBookSecondary = (book: BookCfg) => {
    if (book.id === 'femn-aod-handbook' || book.id === 'simn-fesi-fecr-compendium') {
      navigate('/contact?tab=quote');
      return;
    }
    if (book.id === 'csr-community-chronicle') {
      navigate('/careers');
      return;
    }
    navigate(book.targetRoute ?? '/contact');
  };

  const filteredGroups = CORPORATE_DOCUMENT_GROUPS.filter(
    (g) => filter === 'All' || g.type === filter
  );

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Corporate Documents' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            Statutory Disclosures · CIN {COMPANY_INFO.cin}
          </p>
          <SplitText
            text="Annual returns, CSR governance & policies."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
          />
          <p className="text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
            Statutory filings and governance policies organized by category and financial year. Individual PDF binaries were not downloaded into this prototype bundle; each section links directly to the verified index page on the company website rather than providing placeholder files.
          </p>
        </div>

        {/* Interactive 3D Compendium Stage */}
        <section aria-labelledby="books-compendium-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                3D Technical & Statutory Archive
              </p>
              <h2
                id="books-compendium-heading"
                className="font-display text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]"
              >
                Inspect Bound Reference Dossiers
              </h2>
            </div>
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
              Select any hardcover spine or click Open Volume to inspect tables of contents.
            </p>
          </div>
          <div className="border border-[#10243A]/15 dark:border-[#F4F8FC]/15 overflow-hidden">
            <BooksShowcase
              books={BERRY_COMPENDIUM_BOOKS}
              heroTitle="Compendia"
              navTitle="Berry Alloys Library"
              onPrimaryAction={handleBookPrimary}
              onSecondaryAction={handleBookSecondary}
            />
          </div>
        </section>

        {/* Category Filter */}
        <div
          id="doc-directory"
          role="tablist"
          aria-label="Filter corporate documents by category"
          className="scroll-mt-24 flex flex-wrap items-center gap-1.5 pb-6 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14"
        >
          {(
            [
              'All',
              'Annual Returns (Form MGT-7)',
              'CSR Governance & Projects',
              'Corporate Policies',
            ] as const
          ).map((type) => {
            const active = filter === type;
            return (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(type)}
                className={`min-h-[40px] px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC]'
                    : 'bg-[#F1F6FB] text-[#465C72] hover:bg-[#D4DFEB] hover:text-[#10243A] dark:bg-[#12243B] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC]'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Document Groups */}
        <div className="space-y-10">
          {filteredGroups.map((group) => (
            <section
              key={group.id}
              aria-labelledby={`group-${group.id}`}
              className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 overflow-hidden"
            >
              <div className="p-6 sm:p-8 bg-[#F1F6FB]/75 dark:bg-[#0D1B2E] border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <h2 id={`group-${group.id}`} className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {group.type}
                  </h2>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] max-w-2xl">
                    {group.description}
                  </p>
                </div>

                <a
                  href={group.sourcePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#004C73] transition-colors duration-300 whitespace-nowrap shrink-0"
                >
                  <span>Open Live Portal Index</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              <ul className="divide-y divide-[#10243A]/12 dark:divide-[#F4F8FC]/12">
                {group.items.map((item) => (
                  <li
                    key={`${item.title}-${item.yearOrScope}`}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <FileText
                        className="w-4 h-4 text-brand dark:text-[#69C5F5] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#10243A] dark:text-[#F4F8FC]">
                          {item.title}
                        </p>
                        <p className="text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                          {item.yearOrScope}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pl-7 sm:pl-0">
                      <span className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                        {item.status}
                      </span>
                      <a
                        href={group.sourcePageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline underline-offset-4 transition-colors duration-300 whitespace-nowrap"
                      >
                        Portal Link
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
