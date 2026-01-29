/* CSS load order (enterprise: tokens first, then libs, shared, globals). Admin styles load from app/admin/layout.jsx via adminStyles.js. */
import '../shared/styles/layout.css';
import '../shared/styles/shared.css';
import '../shared/styles/variables.css';
import '../styles/globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: {
    default: 'Premium Tiffin Service',
    template: '%s',
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
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VITE_SITE_URL ||
      'https://homiebites.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VITE_SITE_URL ||
      'https://homiebites.com',
    siteName: 'HomieBites',
    title: 'HomieBites - Premium Tiffin Service',
    description:
      'Delicious home-cooked vegetarian meals delivered to your doorstep. Daily and monthly tiffin subscriptions available.',
    images: [
      {
        url: new URL(
          '/logo.png',
          process.env.NEXT_PUBLIC_SITE_URL ||
            process.env.VITE_SITE_URL ||
            'https://homiebites.com'
        ).toString(),
        width: 1200,
        height: 630,
        alt: 'HomieBites Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomieBites - Premium Tiffin Service',
    description:
      'Delicious home-cooked vegetarian meals delivered to your doorstep.',
    images: [
      new URL(
        '/logo.png',
        process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.VITE_SITE_URL ||
          'https://homiebites.com'
      ).toString(),
    ],
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Manifest will be dynamically loaded by admin layout for admin pages */}
        <link rel="manifest" href="/manifest.json" id="app-manifest" />
        <meta name="theme-color" content="#FF6B35" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover, shrink-to-fit=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Website uses fixed --font-website; admin font from Settings only on /admin routes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
