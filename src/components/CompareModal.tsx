import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AlloyProduct } from '../data/products';

interface CompareModalProps {
  open: boolean;
  products: AlloyProduct[];
  onClose: () => void;
  onRemoveProduct?: (slug: string) => void;
}

export function CompareModal({
  open,
  products,
  onClose,
  onRemoveProduct,
}: CompareModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-[#141618]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F6F4EF] dark:bg-[#191C20] border border-[#141618]/25 dark:border-[#F3F0E9]/20 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-[#141618] dark:text-[#F3F0E9]"
          >
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#141618]/15 dark:border-[#F3F0E9]/14">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C] mb-1">
                  Side-by-Side Specification Matrix
                </p>
                <h3
                  id="compare-modal-title"
                  className="font-display text-2xl sm:text-3xl font-bold text-[#141618] dark:text-[#F3F0E9] tracking-tight"
                >
                  Alloy Chemistry Comparison ({products.length})
                </h3>
                <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1">
                  Exact source min/max qualifiers preserved per product family. Unspecified trace limits are never inferred.
                </p>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close comparison dialog"
                className="inline-flex items-center justify-center w-11 h-11 text-[#141618] dark:text-[#F3F0E9] hover:bg-[#ECE8DF] dark:hover:bg-[#20242A] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {products.length < 2 ? (
              <div className="py-10 text-center text-sm text-[#4A5054] dark:text-[#A1A7AB]">
                Select at least two alloys to compare chemistry specifications side by side.
              </div>
            ) : (
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-[#141618]/20 dark:border-[#F3F0E9]/16">
                      <th className="py-3 pr-4 text-xs font-semibold text-[#4A5054] dark:text-[#A1A7AB] w-48">
                        Element / Qualifier
                      </th>
                      {products.map((p) => (
                        <th key={p.slug} className="py-3 px-4 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="block text-[11px] font-normal text-[#4A5054] dark:text-[#A1A7AB]">
                                {p.family}
                              </span>
                              <Link
                                to={`/products/${p.slug}`}
                                onClick={onClose}
                                className="font-display text-lg font-bold text-[#141618] dark:text-[#F3F0E9] hover:text-[#9E4B28] dark:hover:text-[#EC743C]"
                              >
                                {p.name}
                              </Link>
                            </div>
                            {onRemoveProduct && (
                              <button
                                type="button"
                                onClick={() => onRemoveProduct(p.slug)}
                                aria-label={`Remove ${p.name}`}
                                className="p-1 text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9] cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12 text-xs">
                    {[
                      {
                        title: 'Primary Alloying Element',
                        get: (p: AlloyProduct) => [p.comparison.primaryElementLabel, p.comparison.primaryElementRange],
                      },
                      {
                        title: 'Silicon (Si)',
                        get: (p: AlloyProduct) => [p.comparison.siliconLabel, p.comparison.siliconRange],
                      },
                      {
                        title: 'Carbon (C)',
                        get: (p: AlloyProduct) => [p.comparison.carbonLabel, p.comparison.carbonRange],
                      },
                      {
                        title: 'Phosphorus (P)',
                        get: (p: AlloyProduct) => [p.comparison.phosphorusLabel, p.comparison.phosphorusRange],
                      },
                      {
                        title: 'Sulfur (S)',
                        get: (p: AlloyProduct) => [p.comparison.sulfurLabel, p.comparison.sulfurRange],
                      },
                    ].map((row) => (
                      <tr key={row.title}>
                        <td className="py-3.5 pr-4 font-semibold text-[#141618] dark:text-[#F3F0E9]">
                          {row.title}
                        </td>
                        {products.map((p) => {
                          const [lbl, val] = row.get(p);
                          return (
                            <td key={p.slug} className="py-3.5 px-4 align-top">
                              <span className="block text-[11px] text-[#4A5054] dark:text-[#A1A7AB] mb-0.5">
                                {lbl}
                              </span>
                              <span className="font-mono-tabular font-semibold text-[#141618] dark:text-[#F3F0E9]">
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-[#141618] dark:text-[#F3F0E9]">
                        Trace / Special Limits
                      </td>
                      {products.map((p) => (
                        <td key={p.slug} className="py-3.5 px-4 align-top">
                          {p.comparison.traceElementLabel ? (
                            <>
                              <span className="block text-[11px] text-[#4A5054] dark:text-[#A1A7AB] mb-0.5">
                                {p.comparison.traceElementLabel}
                              </span>
                              <span className="font-mono-tabular text-[#141618] dark:text-[#F3F0E9]">
                                {p.comparison.traceElementRange}
                              </span>
                            </>
                          ) : (
                            <span className="text-[#4A5054] dark:text-[#A1A7AB]">
                              — Not listed in source table
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-[#141618] dark:text-[#F3F0E9]">
                        Sizing & Packing
                      </td>
                      {products.map((p) => (
                        <td key={p.slug} className="py-3.5 px-4 text-[#4A5054] dark:text-[#A1A7AB]">
                          Supplied to customer specification
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 pr-4" />
                      {products.map((p) => (
                        <td key={p.slug} className="py-4 px-4">
                          <Link
                            to={`/contact?tab=quote&product=${p.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#9E4B28] text-[#F6F4EF] hover:bg-[#141618] dark:bg-[#A95632] dark:hover:bg-[#EC743C] dark:hover:text-[#141618] transition-colors whitespace-nowrap"
                          >
                            Request Quote
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
