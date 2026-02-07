"use client";

import { motion } from "framer-motion";
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
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            className="mt-32 mb-16 relative"
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
                <div className="mb-10">
                    <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed mb-5 italic">
                        {t("footer.quote")}
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                </div>

                <div className="flex justify-center gap-4 mb-10">
                    {socialLinks.map((link, index) => (
                        <motion.a
                            key={index}
                            href={link.href}
                            className="btn btn-ghost btn-circle text-gray-500 hover:text-base-content hover:bg-base-200"
                            target={link.href.startsWith('mailto') ? undefined : "_blank"}
                            rel={link.href.startsWith('mailto') ? undefined : "noopener noreferrer"}
                            aria-label={link.label}
                            variants={buttonHoverVariant}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <img src={`/${link.icon}.svg`} alt={link.label} className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                        </motion.a>
                    ))}
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                        {t("footer.copyright", { year: currentYear })}
                    </p>
                    <p className="text-xs text-gray-400">
                        {t("footer.madeWith")}
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;