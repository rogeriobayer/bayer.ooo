import "./globals.css";
import localFont from "next/font/local";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Script from "next/script";
import { detectLocale, getTranslation, localeToOG } from "@/app/lib/locale";
import { headers } from "next/headers";

const stackSansNotch = localFont({
  src: [
    {
      path: "./fonts/stack-sans-notch-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/stack-sans-notch-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const stackSansText = localFont({
  src: [
    {
      path: "./fonts/stack-sans-text-latin-200-normal.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/stack-sans-text-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/stack-sans-text-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/stack-sans-text-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/stack-sans-text-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata() {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const locale = detectLocale(acceptLanguage);

  return {
    metadataBase: new URL('https://bayer.ooo'),
    title: {
      default: "Rogério Bayer - Full-Stack Developer",
      template: "%s | Rogério Bayer"
    },
    description: getTranslation(locale, "apresentation.subtitle"),
    keywords: ["Full-Stack Developer", "React", "Vue.js", "Node.js", "Frontend", "Backend", "Mobile Development", "JavaScript", "TypeScript", "Brazil"],
    author: "Rogério Bayer",
    creator: "Rogério Bayer",
    publisher: "Rogério Bayer",
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
    alternates: {
      canonical: "https://bayer.ooo",
      languages: {
        'pt': 'https://bayer.ooo',
        'en': 'https://bayer.ooo',
        'fr': 'https://bayer.ooo',
      },
    },
    openGraph: {
      type: "website",
      locale: localeToOG(locale),
      alternateLocale: ["en_US", "fr_FR"].filter((l) => l !== localeToOG(locale)),
      url: "https://bayer.ooo",
      title: "Rogério Bayer - Full-Stack Developer",
      description: getTranslation(locale, "apresentation.subtitle"),
      siteName: "Rogério Bayer Portfolio",
      images: [
        {
          url: "/rogeriobayer.png",
          width: 1200,
          height: 630,
          alt: "Rogério Bayer - Full-Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Rogério Bayer - Full-Stack Developer",
      description: getTranslation(locale, "apresentation.subtitle"),
      images: ["/rogeriobayer.png"],
    },
    other: {
      'msapplication-TileColor': '#2b5797',
      'theme-color': '#ffffff',
    },
  };
}

export default async function RootLayout({ children }) {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const locale = detectLocale(acceptLanguage);

  return (
    <html lang={locale} suppressHydrationWarning={true} className={`${stackSansNotch.variable} ${stackSansText.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/rogeriobayer.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f0f0f" media="(prefers-color-scheme: dark)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = 'portfolio';
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved) theme = saved;
                  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'portfolio-dark';
                } catch (e) {}
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "name": "Rogério Bayer",
                  "jobTitle": "Full-Stack Developer",
                  "url": "https://bayer.ooo",
                  "image": "https://bayer.ooo/rogeriobayer.png",
                  "sameAs": [
                    "https://linkedin.com/in/rogeriobayer",
                    "https://github.com/rogeriobayer"
                  ],
                  "knowsAbout": [
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Vue.js",
                    "Node.js",
                    "Full-Stack Development",
                    "Frontend Development",
                    "Backend Development",
                    "Mobile Development"
                  ],
                  "alumniOf": {
                    "@type": "CollegeOrUniversity",
                    "name": "Universidade Federal do Paraná"
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "BR"
                  }
                },
                {
                  "@type": "WebSite",
                  "name": "Rogério Bayer - Full-Stack Developer",
                  "url": "https://bayer.ooo",
                  "description": "Portfolio of Rogério Bayer, experienced Full-Stack Developer specialized in React, Vue.js, Node.js, and modern web technologies.",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://bayer.ooo/blog?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="">
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3JP1FZFB56"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3JP1FZFB56');
          `}
        </Script>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
