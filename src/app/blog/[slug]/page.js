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

  return {
    title: defaultPost.title,
    description: defaultPost.excerpt,
    openGraph: {
      title: `${defaultPost.title} | Rogério Bayer`,
      description: defaultPost.excerpt,
      type: "article",
      publishedTime: defaultPost.date,
      authors: [defaultPost.author],
      tags: defaultPost.tags,
      images: defaultPost.cover ? [{ url: defaultPost.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultPost.title,
      description: defaultPost.excerpt,
      images: defaultPost.cover ? [defaultPost.cover] : undefined,
    },
    alternates: {
      canonical: `https://bayer.ooo/blog/${slug}`,
    },
  };
}

export default function BlogPostPage({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <BlogPost post={post} />
      </main>
      <Footer />
    </div>
  );
}
