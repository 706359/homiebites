'use client';

import { useLanguage } from '../contexts/LanguageContext';
import './BlogSection.css';
import Icon from './ui/Icon.jsx';

const BlogSection = () => {
  const { t } = useLanguage();

  const articles = [
    { key: 'article1', slug: 'benefits-of-less-oil' },
    { key: 'article2', slug: 'how-we-source-ingredients' },
    { key: 'article3', slug: 'weekly-menu-highlights' },
    { key: 'article4', slug: 'story-behind-dal-tadka' },
    { key: 'article5', slug: 'meal-prep-vs-home-delivery' },
  ];

  return (
    <section id="blog" className="blog-section">
      <div className="section-container">
        <div className="blog-header">
          <span className="blog-kicker">
            {t('blog.kicker') || 'Read & learn'}
          </span>
          <h2 className="blog-title">
            {t('blog.title') || 'From Our Kitchen'}
          </h2>
          <p className="blog-subtitle">
            {t('blog.subtitle') ||
              'Tips, stories, and insights on home-style eating and healthy habits.'}
          </p>
        </div>
        <ul className="blog-list" aria-label="Blog articles">
          {articles.map(({ key, slug }) => (
            <li key={key} className="blog-item">
              <a
                href={`/#blog`}
                className="blog-link"
                aria-label={t(`blog.${key}`)}
              >
                <Icon name="file-text" className="blog-link-icon" aria-hidden />
                <span>{t(`blog.${key}`)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BlogSection;
