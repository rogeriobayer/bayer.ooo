import { getAllPosts } from "@/app/lib/blog";
import BlogCard from "@/app/components/Blog/BlogCard";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Blog",
  description: "Artigos, tutoriais e reflexões sobre desenvolvimento de software, tecnologia e design.",
  openGraph: {
    title: "Blog | Rogério Bayer",
    description: "Artigos, tutoriais e reflexões sobre desenvolvimento de software, tecnologia e design.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-base-content mb-4">
              Blog
            </h1>
            <p className="text-lg text-secondary max-w-lg mx-auto">
              Artigos, tutoriais e reflexões sobre desenvolvimento de software, tecnologia e design.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg">
                Nenhum post publicado ainda. Volte em breve!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <BlogCard key={`${post.lang}-${post.slug}`} post={post} lang={post.lang} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
