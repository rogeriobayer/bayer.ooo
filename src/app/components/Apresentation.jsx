"use client";

import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import {
  floatingVariant,
  floatingSlowVariant,
  floatingFastVariant,
  fadeInVariant,
  buttonHoverVariant
} from "@/app/utils/animationConfig";

export const Apresentation = () => {
  const { t } = useTranslation();

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex-wrap items-center justify-between relative py-16 md:py-24">
      {/* Left decorative circles with floating animation */}
      <div className="absolute -left-40 top-0 h-full w-80 pointer-events-none hidden lg:block">
        <motion.img
          alt=""
          src="/circle1.svg"
          className="absolute top-10 left-20 glass-ornament"
          width="80"
          height="80"
          variants={floatingFastVariant}
          animate="float"
        />
        <motion.img
          alt=""
          src="/circle3.svg"
          className="absolute top-40 left-10 glass-ornament"
          width="120"
          height="120"
          variants={floatingSlowVariant}
          animate="float"
        />
        <motion.img
          alt=""
          src="/circle2.svg"
          className="absolute top-80 left-0 glass-ornament"
          width="160"
          height="160"
          variants={floatingVariant}
          animate="float"
        />
        <motion.img
          alt=""
          src="/circle1.svg"
          className="absolute top-72 left-32 glass-ornament"
          width="60"
          height="60"
          variants={floatingFastVariant}
          animate="float"
        />
      </div>

      <motion.div
        className="flex flex-col lg:flex-row justify-between relative z-10 px-6"
        variants={fadeInVariant}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-center flex-col lg:ml-10 max-w-full lg:max-w-[55%]">
          {/* Main heading - stronger typography */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-base-content tracking-tight font-heading">
            {t("apresentation.greeting")}
          </h1>

          {/* Subtitle with better line-height and max-width */}
          <p className="text-lg md:text-xl font-light leading-relaxed mt-6 text-gray-600 max-w-lg">
            {t("apresentation.subtitle")}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <motion.button
              onClick={scrollToProjects}
              className="btn btn-primary"
              variants={buttonHoverVariant}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {t("apresentation.cta.projects")}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </motion.button>
            <motion.a
              href="https://linkedin.com/in/rogerio-bayer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
              variants={buttonHoverVariant}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {t("apresentation.cta.linkedin")}
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </motion.a>
          </div>
        </div>

        {/* Right decorative circles */}
        <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
          <motion.img
            alt=""
            src="/circle2.svg"
            className="absolute -right-20 top-0 glass-ornament hidden md:block"
            width="280"
            height="280"
            variants={floatingSlowVariant}
            animate="float"
          />
          <motion.img
            alt=""
            src="/circle3.svg"
            className="absolute -right-8 top-48 glass-ornament hidden md:block"
            width="180"
            height="180"
            variants={floatingVariant}
            animate="float"
          />
          <motion.img
            alt=""
            src="/circle1.svg"
            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 opacity-70"
            variants={floatingFastVariant}
            animate="float"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Apresentation;
