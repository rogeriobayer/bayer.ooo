import Projects from "@/app/components/Projects";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHeader from "@/app/components/PageHeader";

export const dynamic = "force-static";

export const metadata = {
  title: "Extensões | Rogério Bayer",
  description: "Extensões de navegador que desenvolvi para produtividade e foco.",
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
    title: "Extensões | Rogério Bayer",
    description: "Extensões de navegador que desenvolvi para produtividade e foco.",
    url: "https://bayer.ooo/extensions",
    type: "website",
    siteName: "Rogério Bayer",
    locale: "pt_BR",
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
    title: "Extensões | Rogério Bayer",
    description: "Extensões de navegador que desenvolvi para produtividade e foco.",
    images: ["https://bayer.ooo/rogeriobayer.png"],
  },
};

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
