import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MotionProvider } from './context/MotionContext';
import { GuideProvider } from './context/GuideContext';
import { SearchProvider } from './context/SearchContext';
import { Layout } from './components/Layout';
import { BerryAlloysGuide } from './components/BerryAlloysGuide';
import { SearchCommandModal } from './components/SearchCommandModal';
import { KineticLoader } from './components/ui/KineticLoader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ManufacturingPage } from './pages/ManufacturingPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { CommunityPage } from './pages/CommunityPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FaqPage } from './pages/FaqPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { InsightArticlePage, InsightsPage } from './pages/InsightsPage';
import { PresentationPage } from './pages/PresentationPage';
import { BuyerLandingPage } from './pages/localized/BuyerLandingPage';
import { LocalizedProductPage } from './pages/localized/LocalizedProductPage';
import { RfqPage } from './pages/localized/RfqPage';
import { LocalizedInsightsPage } from './pages/localized/LocalizedInsightsPage';
import { LocalizedLayout } from './components/localized/LocalizedLayout';
import { RfqProvider } from './rfq/RfqContext';
import { AssistantProvider } from './assistant/AssistantContext';
import { DEMO_PRODUCT_SLUG, LOCALES, parseLocalePath } from './i18n/locales';
import { useState } from 'react';

/** The opening splash is for the English homepage experience only. Buyers arriving on a language URL (or the presentation view) go straight to content. */
function LoaderGate() {
  const [allow] = useState(() => typeof window !== 'undefined' && !parseLocalePath(window.location.pathname).locale && window.location.pathname !== '/presentation');
  return allow ? <KineticLoader /> : null;
}

/** Existing (English) site chrome wrapped as a layout route so localised routes can use their own layout. */
function LegacyShell() {
  return (
    <Layout>
      <Outlet />
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
              <Routes>
                {/* Language-specific routes. The URL is the source of truth for the website language. */}
                {LOCALES.map((l) => (
                  <Route key={l} path={`/${l}`} element={<LocalizedLayout locale={l} />}>
                    <Route index element={<BuyerLandingPage locale={l} />} />
                    <Route path={`products/${DEMO_PRODUCT_SLUG}`} element={<LocalizedProductPage locale={l} />} />
                    <Route path="rfq" element={<RfqPage locale={l} />} />
                    <Route path="insights" element={l === 'en' ? <Navigate to="/insights" replace /> : <LocalizedInsightsPage locale={l} />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                ))}
                <Route path="/presentation" element={<PresentationPage />} />
                <Route element={<LegacyShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
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
            <SearchCommandModal />
            <BerryAlloysGuide />
          </GuideProvider>
          </AssistantProvider>
          </RfqProvider>
        </SearchProvider>
      </BrowserRouter>
      </MotionProvider>
    </ThemeProvider>
  );
}
