import Projects from "@/app/components/Projects";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHeader from "@/app/components/PageHeader";
import { detectLocale, getTranslation, localeToOG } from "@/app/lib/locale";
import { headers } from "next/headers";

export const dynamic = "force-static";

export async function generateMetadata() {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const locale = detectLocale(acceptLanguage);

  return {
    title: `${getTranslation(locale, "extensions.title")} | Rogério Bayer`,
    description: getTranslation(locale, "extensions.description"),
    keywords: ["extensões", "browser extensions", "chrome", "produtividade", "focus"],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: "https://bayer.ooo/extensions",
    },
    openGraph: {
      title: `${getTranslation(locale, "extensions.title")} | Rogério Bayer`,
      description: getTranslation(locale, "extensions.description"),
      url: "https://bayer.ooo/extensions",
      type: "website",
      siteName: "Rogério Bayer",
      locale: localeToOG(locale),
      images: [
        {
          url: "https://bayer.ooo/rogeriobayer.png",
          width: 1200,
          height: 630,
          alt: "Extensões | Rogério Bayer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${getTranslation(locale, "extensions.title")} | Rogério Bayer`,
      description: getTranslation(locale, "extensions.description"),
      images: ["https://bayer.ooo/rogeriobayer.png"],
    },
  };
}

export default function ExtensionsPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <PageHeader titleKey="extensions.title" descriptionKey="extensions.description" />
          <Projects type="extensions" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
