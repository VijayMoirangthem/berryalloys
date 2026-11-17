import type { ReactNode } from 'react';

/** Isolated left-to-right run: keeps alloy symbols, numbers, units and email addresses readable inside RTL (Arabic) text. */
export function Ltr({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`inline-block ${className}`}>
      {children}
    </bdi>
  );
}
