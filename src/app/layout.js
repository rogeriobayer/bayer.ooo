import "@fontsource/stack-sans-notch";
import "@fontsource/stack-sans-notch/500.css";
import "@fontsource/stack-sans-text";
import "@fontsource/stack-sans-text/200.css";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";

export const metadata = {
  metadataBase: new URL('https://bayer.ooo'),
  title: {
    default: "Rogério Bayer - Full-Stack Developer",
    template: "%s | Rogério Bayer"
  },
  description: "Portfolio of Rogério Bayer, experienced Full-Stack Developer specialized in React, Vue.js, Node.js, and modern web technologies. Based in Brazil with expertise in frontend, backend, and mobile development.",
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
      'pt-BR': 'https://bayer.ooo',
      'en-US': 'https://bayer.ooo',
      'fr-FR': 'https://bayer.ooo',
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US", "fr_FR"],
    url: "https://bayer.ooo",
    title: "Rogério Bayer - Full-Stack Developer",
    description: "Portfolio of Rogério Bayer, experienced Full-Stack Developer specialized in React, Vue.js, Node.js, and modern web technologies.",
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
    description: "Portfolio of Rogério Bayer, experienced Full-Stack Developer specialized in React, Vue.js, Node.js, and modern web technologies.",
    images: ["/rogeriobayer.png"],
  },
  other: {
    'msapplication-TileColor': '#2b5797',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/rogeriobayer.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
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
            })
          }}
        />
      </head>
      <body className="">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
