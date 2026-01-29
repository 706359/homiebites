'use client';

import { Suspense, lazy, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import OrderModal from '../components/OrderModal';
import PremiumLoader from '../components/PremiumLoader';
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
        <Suspense
          fallback={
            <PremiumLoader message="Loading how it works..." size="small" />
          }
        >
          <HowItWorks onOrderClick={handleOrderClick} />
        </Suspense>
        <Suspense
          fallback={
            <PremiumLoader message="Loading features..." size="small" />
          }
        >
          <Features />
        </Suspense>
        <Suspense
          fallback={<PremiumLoader message="Loading offers..." size="small" />}
        >
          <SpecialOffer onOrderClick={handleOrderClick} />
        </Suspense>
        <Suspense
          fallback={<PremiumLoader message="Loading gallery..." size="small" />}
        >
          <Gallery />
        </Suspense>
        <Suspense
          fallback={
            <PremiumLoader message="Loading testimonials..." size="small" />
          }
        >
          <Testimonials />
        </Suspense>
        <Suspense
          fallback={<PremiumLoader message="Loading FAQ..." size="small" />}
        >
          <FAQ />
        </Suspense>
        <Suspense
          fallback={<PremiumLoader message="Loading blog..." size="small" />}
        >
          <BlogSection />
        </Suspense>
        <Suspense
          fallback={<PremiumLoader message="Loading about..." size="small" />}
        >
          <About />
        </Suspense>
        <Suspense
          fallback={<PremiumLoader message="Loading contact..." size="small" />}
        >
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
