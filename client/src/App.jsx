import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage  from './pages/Landing/LandingPage';
import ServicesPage from './pages/Services/ServicesPage';
import AboutPage    from './pages/About/AboutPage';
import BookPage     from './pages/Book/BookPage';
import ContactPage  from './pages/Contact/ContactPage';
import ScrollToTop  from './components/ScrollToTop';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/book"    element={<BookPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
