// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";   // <-- Add this line
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
}); 

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tuktuk Drive Rental Sri Lanka | Rent a Self-Drive Tuk Tuk",
  description: "Affordable rates, flexible rental options, and easy booking. Discover the freedom of traveling with a unique Self driving Tuktuk experience!.",
  openGraph: {
    title: "Affordable Tuk Tuk Rental Sri Lanka | Rent a Self-Drive Tuk Tuk",
    description: "Affordable rates, flexible rental options, and easy booking. Discover the freedom of traveling with a unique Self driving Tuktuk experience!.",
    url: "https://tuktukdrive.com",
    siteName: "Tuk Tuk Drive",
    images: [
      {
        url: "https://www.tuktukdrive.com/hero/tuktukDrive.jpeg",
        width: 1200,
        height: 630,
        alt: "Sri Lanka Tuk Tuk Rental",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tuktuk Drive Rental Sri Lanka | Rent a Self-Drive Tuk Tuk",
    description: "Affordable rates, flexible rental options, and easy booking. Discover the freedom of traveling with a unique Self driving Tuktuk experience!.",
    images: ["https://www.tuktukdrive.com/hero/tuktukDrive.jpeg"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GTM (head) */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MV3KBBG7');
            `,
          }}
        />

        {/* Google Ads (gtag.js) */}
        <Script
          id="gtag-lib"
          src="https://www.googletagmanager.com/gtag/js?id=AW-11504981103"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-11504981103');
            `,
          }}
        />

        {/* Hotjar */}
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6519274,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />

        {/* Meta Pixel */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1440608530518310');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1440608530518310&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* GTM (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MV3KBBG7"
            height={0}
            width={0}
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
