'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMenuData } from '../../lib/menuData';
import '../../styles/globals.css';

export default function SearchPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const menuData = getMenuData();
    const query = searchQuery.toLowerCase();
    const results = [];

    menuData.forEach((category) => {
      category.items.forEach((item) => {
        if (
          item.name.toLowerCase().includes(query) ||
          category.category.toLowerCase().includes(query)
        ) {
          results.push({
            category: category.category,
            ...item,
            categoryId: category.id,
          });
        }
      });
    });

    setSearchResults(results);
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='search-page'>
        <div className='search-container'>
          <h1 className='search-title'>{t('header.search')}</h1>

          <form onSubmit={handleSearch} className='search-form'>
            <div className='search-input-wrapper'>
              <input
                type='text'
                className='search-input'
                placeholder={t('search.placeholder') || 'Search for dishes, categories...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type='submit' className='btn btn-primary btn-icon'>
                <i className='fa-solid fa-magnifying-glass'></i>
              </button>
            </div>
          </form>

          {searchResults.length > 0 ? (
            <div className='search-results'>
              <h2 className='results-title'>
                {t('search.results') || 'Search Results'} ({searchResults.length})
              </h2>
              <div className='results-grid'>
                {searchResults.map((item, index) => (
                  <div key={`${item.categoryId}-${item.id}-${index}`} className='result-card'>
                    <div className='result-category'>{item.category}</div>
                    <h3 className='result-name'>{item.name}</h3>
                    <div className='result-price'>₹{item.price}</div>
                    <button
                      className='btn btn-primary btn-small btn-full'
                      onClick={() => {
                        router.push('/menu');
                        openOrderModal();
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery ? (
            <div className='no-results'>
              <p>{t('search.noResults') || 'No results found. Try a different search term.'}</p>
            </div>
          ) : (
            <div className='search-placeholder'>
              <i className='fa-solid fa-magnifying-glass'></i>
              <p>{t('search.startSearching') || 'Start typing to search for dishes...'}</p>
            </div>
          )}
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={closeOrderModal} />
    </>
  );
}
