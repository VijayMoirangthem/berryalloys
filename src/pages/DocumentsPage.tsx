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
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Corporate Documents' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Statutory Disclosures · CIN {COMPANY_INFO.cin}
          </p>
          <SplitText
            text="Annual returns, CSR governance & policies."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
          />
          <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
            Statutory filings and governance policies organized by category and financial year. Individual PDF binaries were not downloaded into this prototype bundle; each section links directly to the verified index page on the company website rather than providing placeholder files.
          </p>
        </div>

        {/* Interactive 3D Compendium Stage */}
        <section aria-labelledby="books-compendium-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                3D Technical & Statutory Archive
              </p>
              <h2
                id="books-compendium-heading"
                className="font-display text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]"
              >
                Inspect Bound Reference Dossiers
              </h2>
            </div>
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
              Select any hardcover spine or click Open Volume to inspect tables of contents.
            </p>
          </div>
          <div className="border border-[#141618]/15 dark:border-[#F3F0E9]/15 overflow-hidden">
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
          className="scroll-mt-24 flex flex-wrap items-center gap-1.5 pb-6 border-b border-[#141618]/15 dark:border-[#F3F0E9]/14"
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
                    ? 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
                    : 'bg-[#ECE8DF] text-[#4A5054] hover:bg-[#D8D1C3] hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
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
              className="bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 overflow-hidden"
            >
              <div className="p-6 sm:p-8 bg-[#ECE8DF]/75 dark:bg-[#191C20] border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <h2 id={`group-${group.id}`} className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {group.type}
                  </h2>
                  <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] max-w-2xl">
                    {group.description}
                  </p>
                </div>

                <a
                  href={group.sourcePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#823B1D] transition-colors duration-300 whitespace-nowrap shrink-0"
                >
                  <span>Open Live Portal Index</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              <ul className="divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12">
                {group.items.map((item) => (
                  <li
                    key={`${item.title}-${item.yearOrScope}`}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <FileText
                        className="w-4 h-4 text-[#9E4B28] dark:text-[#EC743C] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#141618] dark:text-[#F3F0E9]">
                          {item.title}
                        </p>
                        <p className="text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                          {item.yearOrScope}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pl-7 sm:pl-0">
                      <span className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
                        {item.status}
                      </span>
                      <a
                        href={group.sourcePageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline underline-offset-4 transition-colors duration-300 whitespace-nowrap"
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
