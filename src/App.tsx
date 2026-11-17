import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
      <BrowserRouter>
        <SearchProvider>
          <GuideProvider>
            <KineticLoader />
            <Layout>
              <Routes>
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
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
            <SearchCommandModal />
            <BerryAlloysGuide />
          </GuideProvider>
        </SearchProvider>
      </BrowserRouter>
      </MotionProvider>
    </ThemeProvider>
  );
}
