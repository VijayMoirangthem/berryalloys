import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CreepyButton } from '../components/ui/CreepyButton';
import { IndustrialButton } from '../components/ui/IndustrialButton';

export function NotFoundPage() {
  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9] py-24 lg:py-32">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 text-center space-y-6">
        <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
          404 · Page Not Found
        </p>
        <h1 className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
          The requested page does not exist
        </h1>
        <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
          Use the links below to return to the Berry Alloys Limited overview, inspect our ferro alloy product specifications, or submit a commercial quotation enquiry.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <CreepyButton to="/" variant="obsidian">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Return Home
          </CreepyButton>
          <IndustrialButton to="/products" variant="outline-light">
            Browse Alloys
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </IndustrialButton>
          <Link
            to="/contact?tab=quote"
            className="inline-flex items-center px-5 py-3 text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline"
          >
            Request Quotation
          </Link>
        </div>
      </div>
    </div>
  );
}
