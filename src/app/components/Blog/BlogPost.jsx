"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInVariant } from "@/app/utils/animationConfig";
import { formatDate } from "@/app/lib/date";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useTranslation } from "@/app/hooks/useTranslation";

const MarkdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-heading font-bold text-base-content mt-10 mb-6 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-base-content mt-8 mb-4 leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-heading font-semibold text-base-content mt-6 mb-3 leading-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base text-secondary leading-relaxed mb-5">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2 hover:text-secondary transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-secondary mb-5 space-y-1.5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-secondary mb-5 space-y-1.5">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted my-6">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-base-300/50 my-8" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-base-content">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-secondary">{children}</em>
  ),
  code: ({ children, inline }) => (
    inline ? (
      <code className="px-1.5 py-0.5 text-sm bg-base-300/50 text-primary rounded font-mono">
        {children}
      </code>
    ) : (
      <pre className="bg-base-200 border border-base-300/30 rounded-lg p-4 overflow-x-auto mb-5">
        <code className="text-sm font-mono text-secondary">{children}</code>
      </pre>
    )
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      className="rounded-lg w-full my-6 border border-base-300/30"
      loading="lazy"
    />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-5">
      <table className="w-full text-sm text-left border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-base-200 text-base-content font-semibold">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-base-300/30">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr>{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-secondary">{children}</td>
  ),
};

export default function BlogPost({ post }) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const translation = post.translations[currentLanguage] || post.translations.pt || Object.values(post.translations)[0];

  if (!translation) return null;

  return (
    <motion.article
      variants={fadeInVariant}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto px-6"
    >
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-base-content transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        {t("blog.backToBlog")}
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-sm text-muted mb-4">
          <span className="font-medium text-base-content">{translation.author}</span>
          <span>·</span>
          <time dateTime={translation.date}>
            {formatDate(translation.date, currentLanguage)}
          </time>
          <span>·</span>
          <span>{translation.readingTime} min</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-bold text-base-content leading-tight mb-4">
          {translation.title}
        </h1>

        {translation.excerpt && (
          <p className="text-lg text-secondary leading-relaxed">
            {translation.excerpt}
          </p>
        )}

        {translation.tags && translation.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {translation.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-base-200 text-muted border border-base-300/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {translation.cover && (
        <img
          src={translation.cover}
          alt={translation.title}
          className="rounded-xl w-full mb-10 border border-base-300/30"
        />
      )}

      <div className="prose-custom">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
          {translation.content}
        </ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-base-300/30">
        <div className="flex items-center justify-end">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-secondary transition-colors"
          >
            {t("blog.backToBlog")}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
