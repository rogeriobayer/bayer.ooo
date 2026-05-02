"use client";

import { motion } from "framer-motion";
import { staggerContainerVariant } from "@/app/utils/animationConfig";
import BlogCard from "./BlogCard";

export default function BlogList({ posts, lang }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-lg">
          Nenhum post encontrado.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid gap-6"
    >
      {posts.map((post) => (
        <BlogCard key={`${post.lang}-${post.slug}`} post={post} lang={lang} />
      ))}
    </motion.div>
  );
}
