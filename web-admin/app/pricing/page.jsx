'use client';

import { Suspense, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { InlineLoader } from '../../components/loaders/LoaderComponents';
import OrderModal from '../../components/OrderModal';
import Pricing from '../../components/Pricing';

export default function PricingPage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <main id="main-content" tabIndex="-1">
        <Suspense fallback={<InlineLoader message="Loading pricing..." />}>
          <Pricing />
        </Suspense>
      </main>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
}
