import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import FullSpin from '../../components/FullSpin';
import Script from 'next/script';
import '@fontsource/noto-sans-tc/400.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nippon Paint AI 解碼: 發掘你的色彩基因',
  description:
    '立即體驗 Nippon Paint COLOR ID LAB ，透過 AI 智能即時分析，解構專屬你的色彩基因，並推薦最匹配的立邦油漆產品與配色方案，為你打造獨一無二的居家風格！',
  // 添加 og image
  openGraph: {
    images: ['https://storage.googleapis.com/assets-presslogic/nippon/base/OG.png'],
  },
  // 站点 icon
  icons: {
    icon: 'https://storage.googleapis.com/assets-presslogic/nippon/base/nippon_202506_banner_v2c.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WD9JKXZN');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WD9JKXZN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Suspense fallback={<FullSpin open={true} />}>{children}</Suspense>
      </body>
    </html>
  );
}
