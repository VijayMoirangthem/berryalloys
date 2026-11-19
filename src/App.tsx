import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MotionProvider } from './context/MotionContext';
import { GuideProvider } from './context/GuideContext';
import { SearchProvider } from './context/SearchContext';
import { Layout } from './components/Layout';
import { BerryAlloysGuide } from './components/BerryAlloysGuide';
import { SearchCommandModal } from './components/SearchCommandModal';
import { MotionDebugPanel } from './components/MotionDebugPanel';
import { KineticLoader } from './components/ui/KineticLoader';
import { PageContentSkeleton } from './components/ui/Skeleton';
import { installRuntimeErrorCapture, setLoaderState } from './lib/motionDiagnostics';
import { HomePage } from './pages/HomePage';
import { LocalizedLayout } from './components/localized/LocalizedLayout';
import { RfqProvider } from './rfq/RfqContext';
import { AssistantProvider } from './assistant/AssistantContext';
import { DEMO_PRODUCT_SLUG, LOCALES, parseLocalePath } from './i18n/locales';

const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const AwardsAchievementsPage = lazy(() =>
  import('./pages/AwardsAchievementsPage').then((m) => ({ default: m.AwardsAchievementsPage }))
);
const ProductsPage = lazy(() =>
  import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const ManufacturingPage = lazy(() =>
  import('./pages/ManufacturingPage').then((m) => ({ default: m.ManufacturingPage }))
);
const SustainabilityPage = lazy(() =>
  import('./pages/SustainabilityPage').then((m) => ({ default: m.SustainabilityPage }))
);
const CommunityPage = lazy(() =>
  import('./pages/CommunityPage').then((m) => ({ default: m.CommunityPage }))
);
const NewsPage = lazy(() => import('./pages/NewsPage').then((m) => ({ default: m.NewsPage })));
const NewsDetailPage = lazy(() =>
  import('./pages/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage }))
);
const CareersPage = lazy(() =>
  import('./pages/CareersPage').then((m) => ({ default: m.CareersPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const DocumentsPage = lazy(() =>
  import('./pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage }))
);
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const InsightsPage = lazy(() =>
  import('./pages/InsightsPage').then((m) => ({ default: m.InsightsPage }))
);
const InsightArticlePage = lazy(() =>
  import('./pages/InsightsPage').then((m) => ({ default: m.InsightArticlePage }))
);
const PresentationPage = lazy(() =>
  import('./pages/PresentationPage').then((m) => ({ default: m.PresentationPage }))
);
const BuyerLandingPage = lazy(() =>
  import('./pages/localized/BuyerLandingPage').then((m) => ({ default: m.BuyerLandingPage }))
);
const LocalizedProductPage = lazy(() =>
  import('./pages/localized/LocalizedProductPage').then((m) => ({ default: m.LocalizedProductPage }))
);
const RfqPage = lazy(() =>
  import('./pages/localized/RfqPage').then((m) => ({ default: m.RfqPage }))
);
const LocalizedInsightsPage = lazy(() =>
  import('./pages/localized/LocalizedInsightsPage').then((m) => ({
    default: m.LocalizedInsightsPage,
  }))
);

/** The signature Berry logo splash auto-plays on fresh homepage (/) visits only; direct links open immediately while still allowing manual "Replay intro" from the footer. */
function LoaderGate() {
  useEffect(() => {
    installRuntimeErrorCapture();
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const isHome = !parseLocalePath(path).locale && (path === '/' || path === '');
      if (!isHome) {
        setLoaderState('skipped', 'Direct non-homepage entry route');
      }
    }
  }, []);
  return <KineticLoader />;
}

/** Existing (English) site chrome wrapped as a layout route so localised routes can use their own layout. */
function LegacyShell() {
  return (
    <Layout>
      <Suspense fallback={<PageContentSkeleton />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <BrowserRouter>
          <SearchProvider>
            <RfqProvider>
              <AssistantProvider>
                <GuideProvider>
                  <LoaderGate />
                  <Suspense fallback={<PageContentSkeleton />}>
                    <Routes>
                      {/* Language-specific routes. The URL is the source of truth for the website language. */}
                      {LOCALES.map((l) => (
                        <Route key={l} path={`/${l}`} element={<LocalizedLayout locale={l} />}>
                          <Route index element={<BuyerLandingPage locale={l} />} />
                          <Route
                            path={`products/${DEMO_PRODUCT_SLUG}`}
                            element={<LocalizedProductPage locale={l} />}
                          />
                          <Route path="rfq" element={<RfqPage locale={l} />} />
                          <Route
                            path="insights"
                            element={
                              l === 'en' ? (
                                <Navigate to="/insights" replace />
                              ) : (
                                <LocalizedInsightsPage locale={l} />
                              )
                            }
                          />
                          <Route path="*" element={<NotFoundPage />} />
                        </Route>
                      ))}
                      <Route path="/presentation" element={<PresentationPage />} />
                      <Route element={<LegacyShell />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/awards-achievements" element={<AwardsAchievementsPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:slug" element={<ProductDetailPage />} />
                        <Route path="/manufacturing" element={<ManufacturingPage />} />
                        <Route path="/sustainability" element={<SustainabilityPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/news" element={<NewsPage />} />
                        <Route path="/news/:slug" element={<NewsDetailPage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/documents" element={<DocumentsPage />} />
                        <Route path="/faq" element={<FaqPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/insights/:slug" element={<InsightArticlePage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Route>
                    </Routes>
                  </Suspense>
                  <SearchCommandModal />
                  <BerryAlloysGuide />
                  <MotionDebugPanel />
                </GuideProvider>
              </AssistantProvider>
            </RfqProvider>
          </SearchProvider>
        </BrowserRouter>
      </MotionProvider>
    </ThemeProvider>
  );
}
