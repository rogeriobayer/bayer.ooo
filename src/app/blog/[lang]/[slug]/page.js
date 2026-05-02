import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs, formatDate } from "@/app/lib/blog";
import BlogPost from "@/app/components/Blog/BlogPost";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({ params }) {
  const { lang, slug } = params;
  const post = getPostBySlug(lang, slug);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Rogério Bayer`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [post.cover] : undefined,
    },
    alternates: {
      canonical: `https://bayer.ooo/blog/${lang}/${slug}`,
    },
  };
}

export default function BlogPostPage({ params }) {
  const { lang, slug } = params;
  const post = getPostBySlug(lang, slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <BlogPost post={post} lang={lang} />
      </main>
      <Footer />
    </div>
  );
}
