"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerItemVariant, cardHoverVariant } from "@/app/utils/animationConfig";
import { formatDate } from "@/app/lib/date";

export default function BlogCard({ post, lang }) {
  return (
    <motion.article
      variants={staggerItemVariant}
      className="group"
    >
      <Link href={`/blog/${post.lang}/${post.slug}`} className="block">
        <motion.div
          variants={cardHoverVariant}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="card bg-base-200/50 border border-base-300/30 rounded-xl p-6 transition-colors hover:bg-base-200"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-muted">
              <time dateTime={post.date}>
                {formatDate(post.date, lang)}
              </time>
              <span>·</span>
              <span>{post.readingTime} min</span>
            </div>

            <h2 className="text-xl font-heading font-semibold text-base-content group-hover:text-primary transition-colors">
              {post.title}
            </h2>

            <p className="text-sm text-secondary leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-base-300/50 text-muted border border-base-300/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
