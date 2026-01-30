'use client';

import { Suspense, lazy, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { InlineLoader } from '../components/loaders/LoaderComponents';
import OrderModal from '../components/OrderModal';
import StructuredData from '../components/StructuredData';
import { useLanguage } from '../contexts/LanguageContext';
import { useRevealAnimation } from '../hooks/useRevealAnimation';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

// Lazy load heavy components for better performance
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const Features = lazy(() => import('../components/Features'));
const SpecialOffer = lazy(() => import('../components/SpecialOffer'));
const Gallery = lazy(() => import('../components/Gallery'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const FAQ = lazy(() => import('../components/FAQ'));
const BlogSection = lazy(() => import('../components/BlogSection'));
const About = lazy(() => import('../components/About'));
const Contact = lazy(() => import('../components/Contact'));

export default function HomePage() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useSmoothScroll();
  useRevealAnimation();

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <StructuredData />
      <Header onOrderClick={handleOrderClick} />
      <main id="main-content" tabIndex="-1">
        <Hero onOrderClick={handleOrderClick} />
        <Suspense fallback={<InlineLoader message="Loading how it works..." />}>
          <HowItWorks onOrderClick={handleOrderClick} />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading features..." />}>
          <Features />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading offers..." />}>
          <SpecialOffer onOrderClick={handleOrderClick} />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading gallery..." />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading testimonials..." />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading FAQ..." />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading blog..." />}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading about..." />}>
          <About />
        </Suspense>
        <Suspense fallback={<InlineLoader message="Loading contact..." />}>
          <Contact />
        </Suspense>
      </main>
      <Footer onOrderClick={handleOrderClick} />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
}
