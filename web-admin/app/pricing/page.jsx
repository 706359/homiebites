'use client';

import { Suspense } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import PremiumLoader from '../../components/PremiumLoader';
import Pricing from '../../components/Pricing';
import { useState } from 'react';

export default function PricingPage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <main id="main-content" tabIndex="-1">
        <Suspense
          fallback={<PremiumLoader message="Loading pricing..." size="small" />}
        >
          <Pricing />
        </Suspense>
      </main>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}
