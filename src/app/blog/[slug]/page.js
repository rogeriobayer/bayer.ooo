import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/app/lib/blog";
import BlogPost from "@/app/components/Blog/BlogPost";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  const defaultPost = post.translations.pt || Object.values(post.translations)[0];
  const canonicalUrl = `https://bayer.ooo/blog/${slug}`;

  return {
    title: `${defaultPost.title} | Rogério Bayer`,
    description: defaultPost.excerpt,
    keywords: defaultPost.tags,
    authors: [{ name: defaultPost.author, url: "https://bayer.ooo" }],
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
      canonical: canonicalUrl,
      languages: {
        'pt-BR': canonicalUrl,
        'en-US': canonicalUrl,
        'fr-FR': canonicalUrl,
      },
    },
    openGraph: {
      title: `${defaultPost.title} | Rogério Bayer`,
      description: defaultPost.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: defaultPost.date,
      modifiedTime: defaultPost.date,
      authors: [defaultPost.author],
      tags: defaultPost.tags,
      siteName: "Rogério Bayer",
      locale: "pt_BR",
      alternateLocale: ["en_US", "fr_FR"],
      images: defaultPost.cover
        ? [
            {
              url: defaultPost.cover,
              width: 1200,
              height: 630,
              alt: defaultPost.title,
            },
          ]
        : [
            {
              url: "https://bayer.ooo/rogeriobayer.png",
              width: 1200,
              height: 630,
              alt: defaultPost.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultPost.title,
      description: defaultPost.excerpt,
      images: defaultPost.cover
        ? [defaultPost.cover]
        : ["https://bayer.ooo/rogeriobayer.png"],
    },
  };
}

export default function BlogPostPage({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const defaultPost = post.translations.pt || Object.values(post.translations)[0];
  const canonicalUrl = `https://bayer.ooo/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: defaultPost.title,
    description: defaultPost.excerpt,
    image: defaultPost.cover || "https://bayer.ooo/rogeriobayer.png",
    datePublished: defaultPost.date,
    dateModified: defaultPost.date,
    author: {
      "@type": "Person",
      name: defaultPost.author,
      url: "https://bayer.ooo",
    },
    publisher: {
      "@type": "Person",
      name: "Rogério Bayer",
      url: "https://bayer.ooo",
      logo: {
        "@type": "ImageObject",
        url: "https://bayer.ooo/rogeriobayer.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: defaultPost.tags?.join(", "),
    inLanguage: defaultPost.lang === "pt" ? "pt-BR" : defaultPost.lang === "en" ? "en-US" : "fr-FR",
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <BlogPost post={post} />
      </main>
      <Footer />
    </div>
  );
}
