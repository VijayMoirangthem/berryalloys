import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ALLOY_FAMILIES, AlloyFamily, getProductBySlug, PRODUCTS } from '../data/products';
import { getKnowledgeById, KnowledgeAction } from '../data/knowledgeBase';
import {
  GuideAnswerPayload,
  GuideConversationContext,
  guideProvider,
  GuideSuggestionChip,
  sanitizePlainText,
} from '../services/guideEngine';

export interface GuideMessage {
  id: string;
  sender: 'guide' | 'user';
  text: string;
  payload?: GuideAnswerPayload;
}

interface GuideContextValue {
  isOpen: boolean;
  messages: GuideMessage[];
  contextState: GuideConversationContext;
  latestAnnouncement: string;
  selectedEnquiryProductSlug: string;
  launcherRef: RefObject<HTMLButtonElement | null>;
  setSelectedEnquiryProductSlug: (slug: string) => void;
  openGuide: (options?: {
    entryId?: string;
    query?: string;
    startQuote?: boolean;
    productSlug?: string;
    returnFocusEl?: HTMLElement | null;
  }) => void;
  closeGuide: () => void;
  resetConversation: () => void;
  sendMessage: (rawText: string) => void;
  selectSuggestion: (chip: GuideSuggestionChip) => void;
  executeAction: (action: KnowledgeAction) => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

function createWelcomeMessage(): GuideMessage {
  const payload = guideProvider.getWelcomePayload();
  return {
    id: 'msg-welcome',
    sender: 'guide',
    text: payload.body,
    payload,
  };
}

let msgCounter = 1;
function nextMsgId(prefix: string): string {
  msgCounter += 1;
  return `${prefix}-${msgCounter}`;
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GuideMessage[]>(() => [
    createWelcomeMessage(),
  ]);
  const [contextState, setContextState] = useState<GuideConversationContext>({
    flowStage: { type: 'idle' },
  });
  const [latestAnnouncement, setLatestAnnouncement] = useState('');
  const [selectedEnquiryProductSlug, setSelectedEnquiryProductSlug] = useState<string>(
    PRODUCTS[0].slug
  );

  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const customReturnFocusRef = useRef<HTMLElement | null>(null);

  const appendTurn = useCallback(
    (userText: string | null, payload: GuideAnswerPayload) => {
      const additions: GuideMessage[] = [];
      if (userText) {
        additions.push({
          id: nextMsgId('user'),
          sender: 'user',
          text: userText,
        });
      }
      additions.push({
        id: nextMsgId('guide'),
        sender: 'guide',
        text: payload.body,
        payload,
      });

      setMessages((prev) => [...prev, ...additions]);
      setContextState(payload.nextContext);
      setLatestAnnouncement(
        payload.title ? `${payload.title}. ${payload.body}` : payload.body
      );
    },
    []
  );

  const openGuide = useCallback(
    (options?: {
      entryId?: string;
      query?: string;
      startQuote?: boolean;
      productSlug?: string;
      returnFocusEl?: HTMLElement | null;
    }) => {
      if (options?.returnFocusEl) {
        customReturnFocusRef.current = options.returnFocusEl;
      } else {
        customReturnFocusRef.current = null;
      }

      setIsOpen(true);

      if (!options) return;

      if (options.entryId) {
        const entry = getKnowledgeById(options.entryId);
        if (entry) {
          const payload = guideProvider.resolveEntryById(
            entry.id,
            contextState
          );
          appendTurn(entry.question, payload);
        }
        return;
      }

      if (options.startQuote) {
        const payload = guideProvider.startQuoteJourney(
          contextState,
          options.productSlug
        );
        appendTurn('Prepare a product quotation', payload);
        return;
      }

      if (options.productSlug && getProductBySlug(options.productSlug)) {
        const product = getProductBySlug(options.productSlug)!;
        const payload = guideProvider.resolveProductDetail(
          product.slug,
          contextState
        );
        appendTurn(`Specifications for ${product.name}`, payload);
        return;
      }

      if (options.query) {
        const clean = sanitizePlainText(options.query);
        if (clean) {
          const payload = guideProvider.resolveQuery({
            text: clean,
            context: contextState,
          });
          appendTurn(clean, payload);
        }
      }
    },
    [appendTurn, contextState]
  );

  const closeGuide = useCallback(() => {
    setIsOpen(false);
    const target = customReturnFocusRef.current ?? launcherRef.current;
    customReturnFocusRef.current = null;
    window.requestAnimationFrame(() => {
      target?.focus();
    });
  }, []);

  const resetConversation = useCallback(() => {
    const welcome = createWelcomeMessage();
    setMessages([welcome]);
    setContextState({ flowStage: { type: 'idle' } });
    setLatestAnnouncement('Conversation reset. ' + welcome.text);
  }, []);

  const sendMessage = useCallback(
    (rawText: string) => {
      const clean = sanitizePlainText(rawText).slice(0, 360);
      if (!clean) {
        const val = guideProvider.resolveQuery({ text: '', context: contextState });
        appendTurn(null, val);
        return;
      }
      const payload = guideProvider.resolveQuery({
        text: clean,
        context: contextState,
      });
      appendTurn(clean, payload);
    },
    [appendTurn, contextState]
  );

  const selectSuggestion = useCallback(
    (chip: GuideSuggestionChip) => {
      if (chip.actionType === 'explore-alloys') {
        const payload: GuideAnswerPayload = {
          kind: 'family-overview',
          title: 'Four Documented Bulk Alloy Families',
          body: 'Choose an alloy family below to inspect available grade series, chemistry bands, and product details.',
          actions: [
            { label: 'View All 10 Grade Series', to: '/products', variant: 'primary' },
          ],
          followUps: ALLOY_FAMILIES.map((family: AlloyFamily) => ({
            label: family,
            actionType: 'select-family',
            family,
          })),
          nextContext: {
            ...contextState,
            flowStage: { type: 'product-explore-family' },
          },
        };
        appendTurn(chip.label, payload);
        return;
      }

      if (chip.actionType === 'select-family' && chip.family) {
        const payload = guideProvider.resolveFamilyJourney(
          chip.family,
          contextState
        );
        appendTurn(chip.family, payload);
        return;
      }

      if (chip.actionType === 'select-product' && chip.productSlug) {
        const payload = guideProvider.resolveProductDetail(
          chip.productSlug,
          contextState
        );
        appendTurn(chip.label, payload);
        return;
      }

      if (chip.actionType === 'start-quote') {
        const payload = guideProvider.startQuoteJourney(contextState);
        appendTurn(chip.label, payload);
        return;
      }

      if (chip.actionType === 'quote-pick-product' && chip.productSlug) {
        const payload = guideProvider.resolveQuoteSelection(
          { productSlug: chip.productSlug },
          contextState
        );
        appendTurn(chip.label, payload);
        return;
      }

      if (chip.actionType === 'quote-not-sure') {
        const payload = guideProvider.resolveQuoteSelection(
          { notSure: true },
          contextState
        );
        appendTurn(chip.label, payload);
        return;
      }

      if (chip.entryId) {
        const payload = guideProvider.resolveEntryById(
          chip.entryId,
          contextState
        );
        appendTurn(chip.label, payload);
        return;
      }

      if (chip.query) {
        sendMessage(chip.query);
      }
    },
    [appendTurn, contextState, sendMessage]
  );

  const executeAction = useCallback(
    (action: KnowledgeAction) => {
      if (action.enquiryProductSlug && getProductBySlug(action.enquiryProductSlug)) {
        setSelectedEnquiryProductSlug(action.enquiryProductSlug);
      }

      setIsOpen(false);
      customReturnFocusRef.current = null;

      if (action.to === '/#enquiry' && location.pathname === '/') {
        window.requestAnimationFrame(() => {
          const el = document.getElementById('enquiry');
          if (el) {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          }
        });
        return;
      }

      navigate(action.to);
    },
    [location.pathname, navigate]
  );

  const value = useMemo<GuideContextValue>(
    () => ({
      isOpen,
      messages,
      contextState,
      latestAnnouncement,
      selectedEnquiryProductSlug,
      launcherRef,
      setSelectedEnquiryProductSlug,
      openGuide,
      closeGuide,
      resetConversation,
      sendMessage,
      selectSuggestion,
      executeAction,
    }),
    [
      closeGuide,
      contextState,
      executeAction,
      isOpen,
      latestAnnouncement,
      messages,
      openGuide,
      resetConversation,
      selectedEnquiryProductSlug,
      selectSuggestion,
      sendMessage,
    ]
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide() {
  const ctx = useContext(GuideContext);
  if (!ctx) {
    throw new Error('useGuide must be used inside GuideProvider');
  }
  return ctx;
}
