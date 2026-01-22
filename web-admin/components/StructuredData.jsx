'use client';

import { useLanguage } from '../contexts/LanguageContext';

const StructuredData = () => {
  const { t } = useLanguage();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VITE_SITE_URL ||
    'https://homiebites.com';

  // LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'HomieBites',
    description:
      'Delicious home-cooked vegetarian meals delivered to your doorstep. Daily and monthly tiffin subscriptions available in Panchsheel Greens and nearby areas.',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    telephone: '+919958983578',
    priceRange: '$$',
    servesCuisine: 'Indian Vegetarian',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Panchsheel Greens',
      addressRegion: 'Delhi',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '28.5355',
      longitude: '77.3910',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '07:00',
        closes: '21:00',
      },
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Panchsheel Greens',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tiffin Service Menu',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MenuItem',
            name: 'Daily Tiffin',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MenuItem',
            name: 'Monthly Subscription',
          },
        },
      ],
    },
  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HomieBites',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://wa.me/919958983578',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919958983578',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HomieBites',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I place an order?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can place an order by contacting us directly via WhatsApp or by calling us.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are your delivery timings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We deliver daily. Last order time is 7:30 PM, and delivery is completed by 8:30 PM.',
        },
      },
      {
        '@type': 'Question',
        name: 'What areas do you deliver to?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We currently deliver to Panchsheel Greens, A1-A5 Towers, B1-B3 Towers, and nearby societies.',
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods do you accept?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept cash on delivery, online payments, and UPI payments.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I customize my order?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer Mix & Match options where you can choose your preferred combination of sabji, rotis, and rice.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer subscription plans?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer monthly subscription plans. Contact us for more details.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

export default StructuredData;
