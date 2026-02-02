'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import OrderModal from '../../../components/OrderModal';
import Icon from '../../../components/ui/Icon.jsx';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getBlogPost } from '../../../shared/blogPosts';
import '../../../styles/globals.css';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug;
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const post = slug ? getBlogPost(slug) : null;

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  if (!post) {
    return (
      <div className="legal-page">
        <Header onOrderClick={openOrderModal} />
        <main id="main-content" tabIndex="-1">
          <div className="legal-content">
            <p>This article could not be found.</p>
            <Link href="/#blog" className="blog-back-link">
              <Icon name="arrow-left" /> Back to From Our Kitchen
            </Link>
          </div>
        </main>
        <Footer onOrderClick={openOrderModal} />
      </div>
    );
  }

  const title = t(`blog.${post.titleKey}`) || post.titleKey;

  return (
    <div className="legal-page blog-post-page">
      <Header onOrderClick={openOrderModal} />
      <main id="main-content" tabIndex="-1">
        <div className="legal-hero">
          <Link href="/#blog" className="blog-back-link blog-back-link-top">
            <Icon name="arrow-left" aria-hidden />
            {t('blog.title') || 'From Our Kitchen'}
          </Link>
          <h1 className="legal-hero-title">{title}</h1>
        </div>
        <div className="legal-content">
          {post.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </main>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={closeOrderModal} />
    </div>
  );
}
