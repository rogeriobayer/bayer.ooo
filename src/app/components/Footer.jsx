"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslation } from "../hooks/useTranslation";
import {
    floatingVariant,
    floatingSlowVariant,
    fadeInVariant,
    buttonHoverVariant
} from "@/app/utils/animationConfig";

import { socialLinks } from "../data/footer.server";

const Footer = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();
    const isBlogPage = pathname?.startsWith('/blog') || pathname?.startsWith('/extensions');

    return (
        <motion.footer
            className="mt-10 mb-16 relative"
            variants={fadeInVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            <div className="absolute -left-32 top-0 h-full w-64 pointer-events-none hidden lg:block">
                <motion.img
                    alt=""
                    src="/circle2.svg"
                    className="absolute top-8 left-20 glass-ornament"
                    width="100"
                    height="100"
                    variants={floatingSlowVariant}
                    animate="float"
                />
            </div>

            <div className="absolute -right-32 top-0 h-full w-64 pointer-events-none hidden lg:block">
                <motion.img
                    alt=""
                    src="/circle1.svg"
                    className="absolute top-12 right-20 glass-ornament"
                    width="120"
                    height="120"
                    variants={floatingVariant}
                    animate="float"
                />
            </div>

            <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                {!isBlogPage && (
                    <div className="mb-10">
                        <p className="text-xl md:text-2xl font-light text-secondary leading-relaxed mb-5 italic">
                            {t("footer.quote")}
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                    </div>
                )}

                {!isBlogPage && (
                    <div className="flex justify-center gap-4 mb-6">
                        <motion.a
                            href="/blog"
                            className="text-sm text-muted hover:text-base-content transition-colors underline underline-offset-4"
                            variants={buttonHoverVariant}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {t("footer.blogLink")}
                        </motion.a>
                        <motion.a
                            href="/extensions"
                            className="text-sm text-muted hover:text-base-content transition-colors underline underline-offset-4"
                            variants={buttonHoverVariant}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {t("extensions.title")}
                        </motion.a>
                    </div>
                )}

                <div className="flex justify-center gap-4 mb-10">
                    {socialLinks.map((link, index) => (
                        <motion.a
                            key={index}
                            href={link.href}
                            className="btn btn-ghost btn-circle text-muted hover:text-base-content hover:bg-base-200"
                            target={link.href.startsWith('mailto') ? undefined : "_blank"}
                            rel={link.href.startsWith('mailto') ? undefined : "noopener noreferrer"}
                            aria-label={link.label}
                            variants={buttonHoverVariant}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <img src={`/${link.icon}.svg`} alt={link.label} className={`w-5 h-5 opacity-70 hover:opacity-100 transition-opacity ${['github', 'behance', 'email', 'linkedin'].includes(link.icon) ? 'icon-dark-invert' : ''}`} />
                        </motion.a>
                    ))}
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted">
                        {t("footer.copyright", { year: currentYear })}
                    </p>
                    <p className="text-xs text-subtle">
                        {t("footer.madeWith")}
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
