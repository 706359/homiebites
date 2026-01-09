import '../shared/styles/shared.css';
import '../styles/globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: {
    default: 'HomieBites - Premium Tiffin Service',
    template: '%s | HomieBites',
  },
  description:
    'Delicious home-cooked vegetarian meals delivered to your doorstep. Daily and monthly tiffin subscriptions available in Panchsheel Greens and nearby areas.',
  keywords: [
    'tiffin service',
    'home cooked meals',
    'vegetarian food',
    'food delivery',
    'Panchsheel Greens',
    'daily meals',
    'subscription meals',
  ],
  authors: [{ name: 'HomieBites' }],
  creator: 'HomieBites',
  publisher: 'HomieBites',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'https://homiebites.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'https://homiebites.com',
    siteName: 'HomieBites',
    title: 'HomieBites - Premium Tiffin Service',
    description:
      'Delicious home-cooked vegetarian meals delivered to your doorstep. Daily and monthly tiffin subscriptions available.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'HomieBites Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomieBites - Premium Tiffin Service',
    description: 'Delicious home-cooked vegetarian meals delivered to your doorstep.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' type='image/png' href='/logo.png' />
        <link rel='apple-touch-icon' href='/logo.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#FF6B35' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover, shrink-to-fit=no' />
        <link
          href='https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
