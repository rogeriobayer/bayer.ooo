import { getAllPosts } from "@/app/lib/blog";
import BlogList from "@/app/components/Blog/BlogList";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHeader from "@/app/components/PageHeader";

export const dynamic = "force-static";

export const metadata = {
  title: "Blog | Rogério Bayer",
  description: "Artigos, tutoriais e reflexões sobre desenvolvimento de software, tecnologia e design.",
  keywords: ["blog", "desenvolvimento", "software", "tecnologia", "nextjs", "react", "frontend"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://bayer.ooo/blog",
  },
  openGraph: {
    title: "Blog | Rogério Bayer",
    description: "Artigos, tutoriais e reflexões sobre desenvolvimento de software, tecnologia e design.",
    url: "https://bayer.ooo/blog",
    type: "website",
    siteName: "Rogério Bayer",
    locale: "pt_BR",
    images: [
      {
        url: "https://bayer.ooo/rogeriobayer.png",
        width: 1200,
        height: 630,
        alt: "Blog | Rogério Bayer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Rogério Bayer",
    description: "Artigos, tutoriais e reflexões sobre desenvolvimento de software, tecnologia e design.",
    images: ["https://bayer.ooo/rogeriobayer.png"],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <PageHeader titleKey="blog.title" descriptionKey="blog.description" />

          <BlogList posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
