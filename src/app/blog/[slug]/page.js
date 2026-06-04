import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/app/lib/blog";
import BlogPost from "@/app/components/Blog/BlogPost";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { detectLocale, localeToOG } from "@/app/lib/locale";
import { headers } from "next/headers";

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

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const locale = detectLocale(acceptLanguage);
  const translation = post.translations[locale] ?? post.translations.pt ?? Object.values(post.translations)[0];
  const canonicalUrl = `https://bayer.ooo/blog/${slug}`;

  return {
    title: `${translation.title} | Rogério Bayer`,
    description: translation.excerpt,
    keywords: translation.tags,
    authors: [{ name: translation.author, url: "https://bayer.ooo" }],
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
        'pt': canonicalUrl,
        'en': canonicalUrl,
        'fr': canonicalUrl,
      },
    },
    openGraph: {
      title: `${translation.title} | Rogério Bayer`,
      description: translation.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: translation.date,
      modifiedTime: translation.date,
      authors: [translation.author],
      tags: translation.tags,
      siteName: "Rogério Bayer",
      locale: localeToOG(locale),
      alternateLocale: Object.values(post.translations)
        .filter((t) => t.lang !== locale)
        .map((t) => localeToOG(t.lang)),
      images: translation.cover
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
    "@graph": [
      {
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Blog",
            item: "https://bayer.ooo/blog",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: defaultPost.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
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
