import type { InsightSlug } from '../i18n/locales';

/**
 * Knowledge-centre guides (English). Status is stated truthfully: these are demonstration drafts that have NOT had
 * metallurgical or commercial sign-off from Berry. No author, approval, publication history or customer story is implied.
 * They deliberately avoid current market prices, regulatory or CBAM advice, and any claim about availability or lead times.
 */
export interface InsightSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  example?: string;
}

export interface InsightArticle {
  slug: InsightSlug;
  status: string;
  date: string;
  readMinutes: number;
  intro: string;
  sections: InsightSection[];
  /** Existing product pages this guide links to. */
  productSlugs: string[];
  /** Where sales or technical confirmation is required. */
  confirm: string[];
}

export const INSIGHT_STATUS = 'Demonstration draft — not yet reviewed by Berry Alloys technical or sales teams';

export const INSIGHT_ARTICLES: Record<InsightSlug, InsightArticle> = {
  'how-to-prepare-a-ferro-alloy-quotation-request': {
    slug: 'how-to-prepare-a-ferro-alloy-quotation-request',
    status: INSIGHT_STATUS,
    date: '2026-11-17',
    readMinutes: 4,
    intro:
      'A supplier can only quote accurately when the request is specific. Most delays come from missing basics: which grade, what size, how much, in what packaging, and delivered where. This guide lists what to include and what a supplier’s sales team still has to confirm.',
    sections: [
      {
        heading: '1. Name the alloy and the grade',
        paragraphs: [
          'State the alloy family and the specific product, not just “ferro manganese”. For example, High Carbon Ferro Manganese is published in standard grades by manganese content (such as 65%, 70%, 73%, 76% and 78% Mn min), with separate low-phosphorus and low-boron variants.',
          'If your steel grade depends on a limit such as phosphorus or boron, say so. It decides which variant is relevant.',
        ],
      },
      {
        heading: '2. Describe the size you need',
        paragraphs: ['Say whether you need lumps, fines or a custom size, and give a range if you have one. If you are unsure, state that you need guidance. A size request describes your furnace or process; it is not a confirmation that the supplier stocks that size.'],
      },
      {
        heading: '3. Give quantity with an explicit unit',
        paragraphs: ['“500” is not a quantity. Write “500 MT per shipment”, “100 MT per month” or “2 containers”. Say whether the quantity is a single order or a recurring requirement, because the commercial discussion is different.'],
      },
      {
        heading: '4. State your packaging preference',
        bullets: ['Bulk (loose)', 'Bags (give the weight, for example 50 kg)', 'Large bags (for example 1 tonne)', 'Other, with a description', 'To discuss'],
        paragraphs: ['Each of these is a preference. Whether it can be supplied for your order is confirmed by the sales team.'],
      },
      {
        heading: '5. Say where it is going and when',
        paragraphs: ['Give the delivery country and, if known, the destination port, plus the period in which you need the material. Early, flexible and fixed dates are all valid; say which applies.'],
      },
      {
        heading: '6. Add technical notes',
        paragraphs: ['Mention the application and any limits that matter, and attach any internal specification you want compared with the published one. Notes can be written in your own language; keep them exactly as you wrote them rather than relying on a machine translation.'],
      },
      {
        heading: 'A complete example',
        example:
          'Product: High Carbon Ferro Manganese, Mn 76% min, low-phosphorus variant.\nSize: lumps (range to be confirmed).\nQuantity: 300 MT per shipment, repeat monthly.\nPackaging: 1-tonne bags (preference).\nDelivery: Busan, South Korea; within 2 months.\nNotes: for structural long steel; internal P limit attached.',
      },
    ],
    productSlugs: ['high-carbon-ferro-manganese', 'high-carbon-silico-manganese'],
    confirm: ['Price and currency', 'Minimum order quantity', 'Availability and lead time', 'Whether a stated size or packaging can be supplied', 'Delivery terms and documentation'],
  },
  'how-to-read-alloy-chemistry-specifications': {
    slug: 'how-to-read-alloy-chemistry-specifications',
    status: INSIGHT_STATUS,
    date: '2026-11-17',
    readMinutes: 5,
    intro:
      'A chemistry table looks simple until a qualifier is misread. “min”, “max” and ranges mean different things, and mixing them up can send a purchase down the wrong grade. This guide explains each, using a published Berry table.',
    sections: [
      {
        heading: 'What “min” means',
        paragraphs: ['“min” is the lowest content the supplier states for that element. Manganese 76% min means the alloy contains at least 76% manganese. Higher is allowed, and for the element that defines the alloy a higher value is generally the point.'],
      },
      {
        heading: 'What “max” means',
        paragraphs: ['“max” is the highest content allowed. For impurities such as phosphorus and sulphur, you want them low. Phosphorus 0.30% max means no more than 0.30%. A lower value is better for most steel grades.'],
      },
      {
        heading: 'What a range means',
        paragraphs: ['A range such as 6–8% describes a band. Ask whether it is a guaranteed limit or a typical value. In the published High Carbon Ferro Manganese table, the carbon column carries a “max” qualifier next to a 6–8% range, so if carbon matters for your steel grade, confirm exactly how it is guaranteed with Berry’s technical team.'],
      },
      {
        heading: 'ppm and percent',
        paragraphs: ['1% equals 10,000 ppm. A boron limit of 50 ppm max is the same as 0.005% max. Never compare a ppm figure with a percentage without converting.'],
      },
      {
        heading: 'A worked example',
        example:
          'High Carbon Ferro Manganese, 76% grade (published table):\nMn 76% min · Si 1.5% max · C 6–8% · P 0.30% max · S 0.03% max.\nReading it: at least 76% manganese; silicon no more than 1.5%; carbon in the 6–8% band as published; phosphorus no more than 0.30%; sulphur no more than 0.03%.',
      },
      {
        heading: 'Checks before you order',
        bullets: ['Read the qualifier above every column, not just the number.', 'Confirm which limits are guaranteed and how they are tested and certified.', 'Compare variants: the low-phosphorus and low-boron variants carry different limits.', 'Keep the original units; do not convert silently.'],
      },
    ],
    productSlugs: ['high-carbon-ferro-manganese', 'ferro-silicon'],
    confirm: ['Which values are guaranteed versus typical', 'Sampling and analysis methods', 'Test certificates provided with a shipment', 'Tolerances for your steel grade'],
  },
  'how-to-describe-sizing-packaging-and-delivery': {
    slug: 'how-to-describe-sizing-packaging-and-delivery',
    status: INSIGHT_STATUS,
    date: '2026-11-17',
    readMinutes: 4,
    intro:
      'After the grade, the next most common cause of back-and-forth is how the material should arrive. A short, precise description of size, packaging and delivery makes the first quotation usable.',
    sections: [
      {
        heading: 'Size',
        paragraphs: ['Lump size is usually written as a range in millimetres. The format below is illustrative only; use your own furnace-charging requirement.'],
        example: 'Lumps, 10–100 mm (illustrative format), with a maximum percentage of undersize if that matters to you.',
        bullets: ['State whether fines are acceptable, unwanted or a separate product.', 'If you are not sure, write “need guidance” and describe your furnace or process.'],
      },
      {
        heading: 'Packaging',
        paragraphs: ['Say how you handle material at your end: bulk, bags of a stated weight, or large bags. Mention any handling limits, such as crane capacity or storage constraints. Your choice is a requirement, and the supplier confirms what it can provide.'],
      },
      {
        heading: 'Delivery',
        bullets: ['Destination country and port', 'Requested delivery period (and whether it is firm or flexible)', 'Whether you need partial shipments', 'Documents you require', 'Any preferred delivery terms, stated as a preference'],
      },
      {
        heading: 'Put it together',
        example: 'Size: lumps, 10–100 mm (illustrative).\nPackaging: 50 kg bags on pallets (preference).\nDelivery: Rotterdam, Netherlands; arrival within 3 months; partial shipments acceptable.',
      },
    ],
    productSlugs: ['high-carbon-ferro-manganese', 'low-medium-carbon-ferro-chrome'],
    confirm: ['Whether the requested size and packaging can be supplied', 'Lead time and shipment scheduling', 'Delivery terms, documentation and any port constraints'],
  },
};
