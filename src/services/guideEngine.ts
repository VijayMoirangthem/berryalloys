import {
  ALLOY_FAMILIES,
  AlloyFamily,
  AlloyProduct,
  getProductBySlug,
  PRODUCTS,
} from '../data/products';
import {
  getKnowledgeById,
  KNOWLEDGE_BASE,
  KnowledgeAction,
  KnowledgeEntry,
} from '../data/knowledgeBase';

export type GuideFlowStage =
  | { type: 'idle' }
  | { type: 'product-explore-family' }
  | { type: 'product-explore-series'; family: AlloyFamily }
  | { type: 'quote-select-product' }
  | { type: 'quote-review'; selectedSlug?: string; notSure?: boolean };

export interface GuideConversationContext {
  activeFamily?: AlloyFamily;
  activeProductSlug?: string;
  lastEntryId?: string;
  flowStage: GuideFlowStage;
}

export interface GuideSuggestionChip {
  label: string;
  query?: string;
  entryId?: string;
  actionType?:
    | 'explore-alloys'
    | 'start-quote'
    | 'select-family'
    | 'select-product'
    | 'quote-pick-product'
    | 'quote-not-sure';
  family?: AlloyFamily;
  productSlug?: string;
}

export interface GuideAnswerPayload {
  kind:
    | 'welcome'
    | 'entry'
    | 'product-spec'
    | 'family-overview'
    | 'clarify-candidates'
    | 'clarify-multi'
    | 'unsupported'
    | 'greeting'
    | 'thanks'
    | 'validation'
    | 'quote-prompt'
    | 'quote-summary';
  title?: string;
  body: string;
  detailNote?: string;
  checklist?: string[];
  specHighlights?: Array<{ label: string; value: string }>;
  actions: KnowledgeAction[];
  followUps: GuideSuggestionChip[];
  nextContext: GuideConversationContext;
  matchedEntryId?: string;
}

export interface GuideQueryInput {
  text: string;
  context: GuideConversationContext;
}

export interface GuideResponseProvider {
  getWelcomePayload(): GuideAnswerPayload;
  resolveQuery(input: GuideQueryInput): GuideAnswerPayload;
  resolveEntryById(
    entryId: string,
    context: GuideConversationContext
  ): GuideAnswerPayload;
  resolveFamilyJourney(
    family: AlloyFamily,
    context: GuideConversationContext
  ): GuideAnswerPayload;
  resolveProductDetail(
    productSlug: string,
    context: GuideConversationContext
  ): GuideAnswerPayload;
  startQuoteJourney(
    context: GuideConversationContext,
    preselectedSlug?: string
  ): GuideAnswerPayload;
  resolveQuoteSelection(
    selection: { productSlug?: string; notSure?: boolean },
    context: GuideConversationContext
  ): GuideAnswerPayload;
}

// ---------------------------------------------------------------------------
// Text Normalization, Defensive Sanitization & Bounded Typo Tolerance
// ---------------------------------------------------------------------------

export function sanitizePlainText(raw: string): string {
  return raw
    .replace(/[<>]/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'is',
  'are',
  'am',
  'was',
  'were',
  'to',
  'for',
  'of',
  'on',
  'in',
  'at',
  'by',
  'with',
  'from',
  'and',
  'or',
  'that',
  'this',
  'it',
  'its',
  'what',
  'where',
  'when',
  'which',
  'how',
  'who',
  'why',
  'do',
  'does',
  'did',
  'can',
  'could',
  'would',
  'should',
  'will',
  'you',
  'your',
  'we',
  'they',
  'i',
  'me',
  'my',
  'get',
  'find',
  'see',
  'tell',
  'give',
  'show',
  'need',
  'want',
  'about',
  'any',
  'have',
  'has',
  'some',
  'more',
  'there',
]);

// Single generic words that should never trigger a standalone direct answer
const GENERIC_SINGLE_WORDS = new Set([
  'company',
  'berry',
  'alloys',
  'alloy',
  'product',
  'products',
  'quality',
  'manufacturing',
  'details',
  'info',
  'information',
  'help',
  'documents',
  'grade',
  'grades',
  'specification',
  'specifications',
  'specs',
]);

const SYNONYM_EXPANSIONS: Array<[RegExp, string]> = [
  [/\bfemn\b/gi, 'ferro manganese'],
  [/\bsimn\b/gi, 'silico manganese'],
  [/\bfecr\b/gi, 'ferro chrome'],
  [/\bfesi\b/gi, 'ferro silicon'],
  [/\b(?:ulc|low\s*c|lc)\b/gi, 'low carbon'],
  [/\b(?:mc)\b/gi, 'medium carbon'],
  [/\b(?:hc)\b/gi, 'high carbon'],
  [/\b(?:lp|low\s*p|phos)\b/gi, 'low phosphorus'],
  [/\b(?:rfq|quotes|pricing)\b/gi, 'quotation'],
  [/\bvizag\b/gi, 'visakhapatnam'],
  [/\bspec(?:s)?\b/gi, 'specification'],
  [/\bcert(?:s|ificate|ificates)?\b/gi, 'certification'],
  [/\bbrochure(?:s)?\b/gi, 'datasheet'],
  [/\bjob(?:s)?\b/gi, 'careers'],
  [/\bopening(?:s)?\b/gi, 'vacancies'],
];

function normalizeText(input: string): string {
  let s = sanitizePlainText(input).toLowerCase();
  for (const [pattern, replacement] of SYNONYM_EXPANSIONS) {
    s = s.replace(pattern, replacement);
  }
  return s
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(normalized: string): string[] {
  if (!normalized) return [];
  return normalized
    .split(/\s+/)
    .filter((tok) => tok.length >= 2 && !STOP_WORDS.has(tok));
}

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = Math.min(prev, dp[j], dp[j - 1]) + 1;
      }
      prev = temp;
    }
  }
  return dp[b.length];
}

function tokenMatchesTarget(tok: string, target: string): number {
  if (tok === target) return 1.0;
  if (tok.length >= 4 && target.startsWith(tok)) return 0.75;
  if (tok.length >= 4 && target.length >= 4) {
    const maxDist = tok.length >= 6 && target.length >= 6 ? 2 : 1;
    const dist = editDistance(tok, target);
    if (dist <= maxDist) return dist === 1 ? 0.8 : 0.65;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Intent & Commercial Guardrails
// ---------------------------------------------------------------------------

const UNSUPPORTED_COMMERCIAL_PATTERNS: Array<{ pattern: RegExp; topic: string }> = [
  { pattern: /\b(price|pricing|cost|rate|per\s*ton|per\s*mt|usd|inr|rupee|dollar)\b/i, topic: 'pricing' },
  { pattern: /\b(moq|minimum\s+order|minimum\s+qty|minimum\s+tonnage)\b/i, topic: 'minimum order quantities' },
  { pattern: /\b(stock|inventory|in\s+stock|ready\s+stock|available\s+now|live\s+availability)\b/i, topic: 'real-time inventory availability' },
  { pattern: /\b(lead\s*time|delivery\s+time|turnaround|how\s+fast|dispatch\s+days)\b/i, topic: 'lead times' },
  { pattern: /\b(payment\s+terms?|credit\s+days?|letter\s+of\s+credit|l\/c|advance\s+payment)\b/i, topic: 'payment terms' },
  { pattern: /\b(freight\s+rate|shipping\s+cost|shipping\s+rate|cif\s+rate|fob\s+rate|shipping\s+terms)\b/i, topic: 'freight and shipping terms' },
  { pattern: /\b(free\s+sample|physical\s+sample|courier\s+sample|send\s+sample)\b/i, topic: 'sample dispatch policies' },
  { pattern: /\b(custom\s+grade|custom\s+chemistry|bespoke\s+grade|bespoke\s+alloy)\b/i, topic: 'custom non-standard grades' },
];

const GREETING_PATTERN = /^(hi|hello|hey|good\s+(morning|afternoon|evening)|namaste|greetings)[!.?]*$/i;
const THANKS_PATTERN = /^(thanks|thank\s+you|thx|cheers|ok|okay|got\s+it|great|helpful)[!.?]*$/i;
const AMBIGUOUS_FOLLOWUP_PATTERN =
  /\b(its\s+spec|their\s+spec|what\s+about\s+(spec|carbon|chemistry|that|this)|tell\s+me\s+more|more\s+about\s+it|enquire\s+about\s+it|quote\s+for\s+it)\b/i;

export const STARTER_SUGGESTIONS: GuideSuggestionChip[] = [
  { label: 'Explore our alloys', actionType: 'explore-alloys' },
  { label: 'Find product specifications', entryId: 'where-see-specifications' },
  { label: 'Request a quotation', actionType: 'start-quote' },
  { label: 'Manufacturing and quality', entryId: 'manufacturing-processes' },
  { label: 'Contact the company', entryId: 'how-contact-company' },
];

function buildProductSpecPayload(
  product: AlloyProduct,
  context: GuideConversationContext
): GuideAnswerPayload {
  const highlights: Array<{ label: string; value: string }> = [
    { label: product.comparison.primaryElementLabel, value: product.comparison.primaryElementRange },
    { label: product.comparison.siliconLabel, value: product.comparison.siliconRange },
    { label: product.comparison.carbonLabel, value: product.comparison.carbonRange },
    { label: product.comparison.phosphorusLabel, value: product.comparison.phosphorusRange },
    { label: product.comparison.sulfurLabel, value: product.comparison.sulfurRange },
  ];
  if (product.comparison.traceElementLabel && product.comparison.traceElementRange) {
    highlights.push({
      label: product.comparison.traceElementLabel,
      value: product.comparison.traceElementRange,
    });
  }

  return {
    kind: 'product-spec',
    title: product.name,
    body: product.summary,
    detailNote: `${product.productionProcess} Applications listed in company records: ${product.applications.slice(0, 3).join('; ')}.`,
    specHighlights: highlights,
    actions: [
      {
        label: `View Full ${product.shortName} Specs`,
        to: `/products/${product.slug}`,
        variant: 'primary',
      },
      {
        label: `Prepare Quote for ${product.shortName}`,
        to: `/contact?tab=quote&product=${product.slug}`,
        variant: 'secondary',
        enquiryProductSlug: product.slug,
      },
    ],
    followUps: [
      { label: 'Prepare a quotation for this alloy', actionType: 'quote-pick-product', productSlug: product.slug },
      { label: `Browse other ${product.family} grades`, actionType: 'select-family', family: product.family },
      { label: 'Are downloadable PDF specs available?', entryId: 'product-related-documents' },
    ],
    nextContext: {
      ...context,
      activeFamily: product.family,
      activeProductSlug: product.slug,
      lastEntryId: 'where-see-specifications',
      flowStage: { type: 'idle' },
    },
  };
}

function matchProductOrFamily(normalized: string, tokens: string[]): {
  product?: AlloyProduct;
  family?: AlloyFamily;
} {
  // Exact/high-specificity product match first
  const scoredProducts: Array<{ product: AlloyProduct; score: number }> = [];

  for (const product of PRODUCTS) {
    const pName = normalizeText(product.name);
    const pShort = normalizeText(product.shortName);
    let score = 0;

    if (normalized.includes(pName)) score += 12;
    else if (normalized.includes(pShort)) score += 9;

    // Specific distinguishing combinations
    if (
      product.slug === 'ferro-silicon' &&
      (normalized.includes('ferro silicon') || normalized.includes('70 72') || /\b(?:70|72)\b/.test(normalized) && tokens.includes('silicon'))
    ) {
      score += 8;
    }
    if (
      product.slug === 'low-medium-carbon-ferro-chrome' &&
      (normalized.includes('ferro chrome') || normalized.includes('chrome'))
    ) {
      score += 8;
    }

    const nameTokens = tokenize(pName);
    let matchedCount = 0;
    for (const nt of nameTokens) {
      for (const tok of tokens) {
        if (tokenMatchesTarget(tok, nt) >= 0.75) {
          matchedCount++;
          break;
        }
      }
    }
    if (nameTokens.length > 0 && matchedCount >= Math.max(2, nameTokens.length - 1)) {
      score += matchedCount * 2;
    }

    if (product.slug.includes('low-phosphorus') && normalized.includes('low phosphorus')) {
      score += 3.5;
    }
    if (product.slug.includes('medium-carbon') && normalized.includes('medium carbon')) {
      score += 3;
    }
    if (product.slug.includes('low-carbon') && normalized.includes('low carbon')) {
      score += 3;
    }
    if (product.slug.includes('high-carbon') && normalized.includes('high carbon')) {
      score += 2.5;
    }

    if (score > 0) scoredProducts.push({ product, score });
  }

  scoredProducts.sort((a, b) => b.score - a.score);
  if (scoredProducts[0] && scoredProducts[0].score >= 8) {
    return { product: scoredProducts[0].product, family: scoredProducts[0].product.family };
  }

  // Family match check (exact phrase or typo-tolerant all-token match)
  for (const fam of ALLOY_FAMILIES) {
    const fNorm = normalizeText(fam);
    if (normalized.includes(fNorm)) {
      return { family: fam };
    }
    const famTokens = tokenize(fNorm);
    const allMatched = famTokens.every((ft) =>
      tokens.some((tok) => tokenMatchesTarget(tok, ft) >= 0.65)
    );
    if (allMatched && famTokens.length >= 2) {
      return { family: fam };
    }
  }
  return {};
}

interface ScoredCandidate {
  entry: KnowledgeEntry;
  score: number;
  matchedDistinctTokens: number;
}

function scoreKnowledgeEntries(normalized: string, tokens: string[]): ScoredCandidate[] {
  const candidates: ScoredCandidate[] = [];

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    const matchedTokenSet = new Set<string>();

    const qNorm = normalizeText(entry.question);
    if (normalized === qNorm) {
      score += 20;
    } else if (qNorm.includes(normalized) && normalized.length >= 10) {
      score += 8;
    }

    for (const phrase of entry.alternativePhrases) {
      const pNorm = normalizeText(phrase);
      if (normalized.includes(pNorm) || (normalized.length >= 12 && pNorm.includes(normalized))) {
        score += 9;
      }
    }

    // Weighted keyword & question token matching
    for (const kw of entry.keywords) {
      const kwNorm = normalizeText(kw);
      if (kwNorm.includes(' ')) {
        if (normalized.includes(kwNorm)) {
          score += 5.5;
          kwNorm.split(' ').forEach((part) => matchedTokenSet.add(part));
        }
      } else {
        for (const tok of tokens) {
          const strength = tokenMatchesTarget(tok, kwNorm);
          if (strength > 0) {
            const weight = GENERIC_SINGLE_WORDS.has(kwNorm) ? 1.1 : 3.2;
            score += weight * strength;
            matchedTokenSet.add(tok);
          }
        }
      }
    }

    const questionTokens = tokenize(qNorm);
    for (const qt of questionTokens) {
      for (const tok of tokens) {
        const strength = tokenMatchesTarget(tok, qt);
        if (strength > 0) {
          const weight = GENERIC_SINGLE_WORDS.has(qt) ? 0.6 : 1.6;
          score += weight * strength;
          matchedTokenSet.add(tok);
        }
      }
    }

    if (score > 0) {
      candidates.push({
        entry,
        score,
        matchedDistinctTokens: matchedTokenSet.size,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

function buildEntryPayload(
  entry: KnowledgeEntry,
  context: GuideConversationContext
): GuideAnswerPayload {
  const followUps: GuideSuggestionChip[] = entry.relatedIds
    .slice(0, 3)
    .map((id) => getKnowledgeById(id))
    .filter((rel): rel is KnowledgeEntry => Boolean(rel))
    .map((rel) => ({
      label: rel.question,
      entryId: rel.id,
    }));

  return {
    kind: 'entry',
    title: entry.question,
    body: entry.answer,
    detailNote: entry.expandedExplanation,
    actions: entry.actions,
    followUps,
    matchedEntryId: entry.id,
    nextContext: {
      ...context,
      lastEntryId: entry.id,
      flowStage: { type: 'idle' },
    },
  };
}

class DeterministicGuideProvider implements GuideResponseProvider {
  getWelcomePayload(): GuideAnswerPayload {
    return {
      kind: 'welcome',
      body: 'Welcome to Berry Compass. Explore our alloys, find technical information, or prepare an enquiry.',
      actions: [],
      followUps: STARTER_SUGGESTIONS,
      nextContext: { flowStage: { type: 'idle' } },
    };
  }

  resolveEntryById(
    entryId: string,
    context: GuideConversationContext
  ): GuideAnswerPayload {
    const entry = getKnowledgeById(entryId);
    if (!entry) {
      return this.getWelcomePayload();
    }
    return buildEntryPayload(entry, context);
  }

  resolveFamilyJourney(
    family: AlloyFamily,
    _context: GuideConversationContext
  ): GuideAnswerPayload {
    const familyProducts = PRODUCTS.filter((p) => p.family === family);
    if (familyProducts.length === 1) {
      return buildProductSpecPayload(familyProducts[0], {
        activeFamily: family,
        flowStage: { type: 'idle' },
      });
    }

    const followUps: GuideSuggestionChip[] = familyProducts.slice(0, 4).map((p) => ({
      label: `${p.name} (${p.shortName})`,
      actionType: 'select-product',
      productSlug: p.slug,
    }));

    if (familyProducts.length > 4) {
      followUps.push({
        label: `View all ${familyProducts.length} ${family} series on Products`,
        entryId: 'where-see-specifications',
      });
    }

    return {
      kind: 'family-overview',
      title: `${family} — ${familyProducts.length} Documented Grade Series`,
      body: `Select a specific ${family} grade series below to view documented chemistry highlights (Mn/Si/Cr, C, P, S, and trace limits) or proceed to the specification page.`,
      actions: [
        { label: `Browse ${family} on Products`, to: '/products', variant: 'primary' },
        { label: 'Open Homepage Alloy Explorer', to: '/#alloys', variant: 'secondary' },
      ],
      followUps,
      nextContext: {
        activeFamily: family,
        activeProductSlug: familyProducts[0]?.slug,
        flowStage: { type: 'product-explore-series', family },
      },
    };
  }

  resolveProductDetail(
    productSlug: string,
    context: GuideConversationContext
  ): GuideAnswerPayload {
    const product = getProductBySlug(productSlug);
    if (!product) return this.getWelcomePayload();
    return buildProductSpecPayload(product, context);
  }

  startQuoteJourney(
    context: GuideConversationContext,
    preselectedSlug?: string
  ): GuideAnswerPayload {
    if (preselectedSlug && getProductBySlug(preselectedSlug)) {
      return this.resolveQuoteSelection({ productSlug: preselectedSlug }, context);
    }

    return {
      kind: 'quote-prompt',
      title: 'Prepare a Product Quotation Enquiry',
      body: 'Which alloy family interests you? Choose an alloy below, or select “I’m not sure yet” to review suggested commercial details before opening the enquiry form.',
      actions: [],
      followUps: [
        ...ALLOY_FAMILIES.map((family) => {
          const firstInFamily = PRODUCTS.find((p) => p.family === family);
          return {
            label: family,
            actionType: 'quote-pick-product' as const,
            productSlug: firstInFamily?.slug,
          };
        }),
        { label: "I'm not sure yet", actionType: 'quote-not-sure' },
      ],
      nextContext: {
        ...context,
        flowStage: { type: 'quote-select-product' },
      },
    };
  }

  resolveQuoteSelection(
    selection: { productSlug?: string; notSure?: boolean },
    context: GuideConversationContext
  ): GuideAnswerPayload {
    const chosenProduct = selection.productSlug
      ? getProductBySlug(selection.productSlug)
      : undefined;

    if (chosenProduct) {
      return {
        kind: 'quote-summary',
        title: `Quotation Preparation — ${chosenProduct.name}`,
        body: `Your selected alloy (${chosenProduct.name}) can be carried straight into the Commercial Quotation Desk. No personal details are collected inside this chat.`,
        detailNote:
          'When submitting the quotation form, it is helpful—though optional—to include the following preparation details:',
        checklist: [
          `Target grade or carbon/phosphorus tier (e.g., ${chosenProduct.comparison.carbonRange}, P ${chosenProduct.comparison.phosphorusRange})`,
          'Estimated tonnage / lot quantity and lump size preference',
          'Packing requirement (e.g., 1 MT jumbo bags or bulk) and destination / FOB port',
          'Steelmaking or foundry application',
        ],
        actions: [
          {
            label: `Open Quotation Form (${chosenProduct.shortName})`,
            to: `/contact?tab=quote&product=${chosenProduct.slug}`,
            variant: 'primary',
            enquiryProductSlug: chosenProduct.slug,
          },
          {
            label: `Use Homepage Enquiry Desk`,
            to: `/#enquiry`,
            variant: 'secondary',
            enquiryProductSlug: chosenProduct.slug,
          },
        ],
        followUps: [
          { label: `Inspect ${chosenProduct.shortName} specs first`, actionType: 'select-product', productSlug: chosenProduct.slug },
          { label: 'Choose a different alloy', actionType: 'start-quote' },
          { label: 'How do I contact Berry Alloys directly?', entryId: 'how-contact-company' },
        ],
        nextContext: {
          activeFamily: chosenProduct.family,
          activeProductSlug: chosenProduct.slug,
          lastEntryId: 'how-request-quotation',
          flowStage: { type: 'quote-review', selectedSlug: chosenProduct.slug },
        },
      };
    }

    return {
      kind: 'quote-summary',
      title: 'Quotation Preparation — General Alloy Requirement',
      body: 'No specific alloy selected yet. You can review our 4 alloy families first or open the Quotation / General Enquiry form directly to describe your steelmaking requirement.',
      detailNote:
        'Suggested details to help our commercial team respond accurately once submitted via the form:',
      checklist: [
        'Primary steelmaking or foundry application',
        'Desired Mn, Si, or Cr alloy family and any carbon/phosphorus ceiling',
        'Approximate tonnage, lump sizing, and delivery destination or port',
      ],
      actions: [
        { label: 'Open General / Quotation Form', to: '/contact?tab=quote', variant: 'primary' },
        { label: 'Explore Alloy Families First', to: '/products', variant: 'secondary' },
      ],
      followUps: [
        { label: 'Explore our alloys', actionType: 'explore-alloys' },
        { label: 'How do I contact Berry Alloys directly?', entryId: 'how-contact-company' },
      ],
      nextContext: {
        ...context,
        lastEntryId: 'what-to-include-enquiry',
        flowStage: { type: 'quote-review', notSure: true },
      },
    };
  }

  resolveQuery({ text, context }: GuideQueryInput): GuideAnswerPayload {
    const cleaned = sanitizePlainText(text);
    if (!cleaned) {
      return {
        kind: 'validation',
        body: 'Please enter a question or pick one of the topics below.',
        actions: [],
        followUps: STARTER_SUGGESTIONS,
        nextContext: context,
      };
    }

    const boundedText = cleaned.slice(0, 360);
    const normalized = normalizeText(boundedText);

    if (GREETING_PATTERN.test(cleaned)) {
      return {
        kind: 'greeting',
        body: 'Hello. Welcome to Berry Compass — automated product assistant answering from prepared company information. How can I assist you today?',
        actions: [],
        followUps: STARTER_SUGGESTIONS,
        nextContext: context,
      };
    }

    if (THANKS_PATTERN.test(cleaned)) {
      return {
        kind: 'thanks',
        body: 'You are welcome. Feel free to explore another alloy topic, browse all FAQs, or prepare a quotation request.',
        actions: [
          { label: 'View All FAQs', to: '/faq', variant: 'secondary' },
          { label: 'Open Quotation Desk', to: '/contact?tab=quote', variant: 'primary' },
        ],
        followUps: [
          { label: 'Explore our alloys', actionType: 'explore-alloys' },
          { label: 'How do I contact Berry Alloys directly?', entryId: 'how-contact-company' },
        ],
        nextContext: context,
      };
    }

    // Context-aware follow-up handling ("What about its specs?")
    if (AMBIGUOUS_FOLLOWUP_PATTERN.test(normalized)) {
      if (context.activeProductSlug) {
        const activeProd = getProductBySlug(context.activeProductSlug);
        if (activeProd) {
          if (/\b(quote|enquire|buy)\b/i.test(normalized)) {
            return this.resolveQuoteSelection({ productSlug: activeProd.slug }, context);
          }
          return buildProductSpecPayload(activeProd, context);
        }
      }
      if (context.activeFamily) {
        return this.resolveFamilyJourney(context.activeFamily, context);
      }
      return {
        kind: 'clarify-candidates',
        title: 'Which Alloy Should We Focus On?',
        body: 'Could you clarify which alloy family or grade you would like specifications for?',
        actions: [{ label: 'Open Full Specifications', to: '/products', variant: 'secondary' }],
        followUps: ALLOY_FAMILIES.map((family) => ({
          label: family,
          actionType: 'select-family',
          family,
        })),
        nextContext: context,
      };
    }

    const tokens = tokenize(normalized);

    // Explicitly intercept unsupported commercial queries (pricing, MOQ, stock, lead time, payment terms, freight, samples)
    for (const rule of UNSUPPORTED_COMMERCIAL_PATTERNS) {
      if (rule.pattern.test(normalized)) {
        const entry = getKnowledgeById('pricing-moq-leadtime-shipping');
        if (entry) {
          return {
            ...buildEntryPayload(entry, context),
            title: `About ${rule.topic.charAt(0).toUpperCase() + rule.topic.slice(1)}`,
            body: `Information on ${rule.topic} is not available in Berry Compass. ${entry.answer}`,
          };
        }
      }
    }

    // Check if visitor asked directly about a specific product or family + isn't primarily asking about pricing/quote
    const productHit = matchProductOrFamily(normalized, tokens);
    const isQuotationAsk = /\b(quotation|enquire|enquiry|order)\b/i.test(normalized);
    if (productHit.product && isQuotationAsk) {
      return this.resolveQuoteSelection({ productSlug: productHit.product.slug }, context);
    }
    if (productHit.product) {
      return buildProductSpecPayload(productHit.product, context);
    }
    if (productHit.family && tokens.length <= 4) {
      return this.resolveFamilyJourney(productHit.family, context);
    }

    // Prevent single generic words from producing overconfident direct answers
    if (tokens.length === 1 && GENERIC_SINGLE_WORDS.has(tokens[0])) {
      const tok = tokens[0];
      const candidates = scoreKnowledgeEntries(normalized, tokens).slice(0, 3);
      return {
        kind: 'clarify-candidates',
        title: `Clarify "${tok}"`,
        body: `Your term "${tok}" relates to a few prepared company topics. Which one would you like to view?`,
        actions: [{ label: 'Browse All FAQs', to: '/faq', variant: 'secondary' }],
        followUps:
          candidates.length > 0
            ? candidates.map((c) => ({ label: c.entry.question, entryId: c.entry.id }))
            : STARTER_SUGGESTIONS,
        nextContext: context,
      };
    }

    // Score against KNOWLEDGE_BASE
    const candidates = scoreKnowledgeEntries(normalized, tokens);
    const top = candidates[0];
    const second = candidates[1];

    // Check for compound / multi-intent requests across distinct categories
    const strongDistinctCategories = new Set<string>();
    const strongEntries: KnowledgeEntry[] = [];
    for (const cand of candidates) {
      if (cand.score >= 7.5 && !strongDistinctCategories.has(cand.entry.category)) {
        strongDistinctCategories.add(cand.entry.category);
        strongEntries.push(cand.entry);
      }
      if (strongEntries.length >= 3) break;
    }

    const hasCompoundSignal =
      (normalized.includes(' and ') || normalized.includes(' also ') || (boundedText.match(/\?/g)?.length ?? 0) >= 2) &&
      strongEntries.length >= 2 &&
      candidates[1] &&
      candidates[0].score - candidates[1].score <= 5;

    if (hasCompoundSignal) {
      return {
        kind: 'clarify-multi',
        title: 'Multiple Topics Detected',
        body: `It looks like you asked about more than one subject (${strongEntries.map((e) => e.category).join(' and ')}). Which topic would you like to explore first?`,
        actions: [{ label: 'Browse Full FAQ Directory', to: '/faq', variant: 'secondary' }],
        followUps: strongEntries.map((e) => ({
          label: e.question,
          entryId: e.id,
        })),
        nextContext: context,
      };
    }

    // Conservative direct-answer threshold
    if (top && top.score >= 6.5 && (top.matchedDistinctTokens >= 2 || top.score >= 11)) {
      if (second && top.score < 12 && top.score - second.score <= 1.2 && top.entry.category !== second.entry.category) {
        return {
          kind: 'clarify-candidates',
          title: 'Two Related Topics Found',
          body: 'Your question matches a couple of prepared topics. Please choose the one closest to what you need:',
          actions: [],
          followUps: candidates.slice(0, 3).map((c) => ({
            label: c.entry.question,
            entryId: c.entry.id,
          })),
          nextContext: context,
        };
      }

      // If visitor asked about a specific family alongside another keyword
      if (productHit.family) {
        return {
          ...buildEntryPayload(top.entry, context),
          nextContext: {
            ...context,
            activeFamily: productHit.family,
            lastEntryId: top.entry.id,
            flowStage: { type: 'idle' },
          },
        };
      }

      return buildEntryPayload(top.entry, context);
    }

    // Plausible partial match -> offer candidate clarifications
    if (top && top.score >= 3.2) {
      return {
        kind: 'clarify-candidates',
        title: 'Choose the Closest Topic',
        body: 'I found a few related topics in prepared company records. Select one below to view the full answer:',
        actions: [{ label: 'Search All FAQs', to: '/faq', variant: 'secondary' }],
        followUps: candidates.slice(0, 3).map((c) => ({
          label: c.entry.question,
          entryId: c.entry.id,
        })),
        nextContext: context,
      };
    }

    // Unsupported or out-of-scope query -> honest limitation + working actions
    return {
      kind: 'unsupported',
      title: 'Outside Prepared Topics',
      body: 'That specific information is not available in Berry Compass. You can explore our FAQs, browse documented specifications, or submit a commercial enquiry directly.',
      actions: [
        { label: 'View All FAQs', to: '/faq', variant: 'secondary' },
        { label: 'Open Quotation / Contact Desk', to: '/contact?tab=general', variant: 'primary' },
      ],
      followUps: STARTER_SUGGESTIONS,
      nextContext: context,
    };
  }
}

export const guideProvider: GuideResponseProvider = new DeterministicGuideProvider();
