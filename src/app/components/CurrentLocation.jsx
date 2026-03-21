"use client";

import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import {
  fadeInVariant,
  floatingVariant,
  floatingSlowVariant,
  staggerContainerVariant,
  staggerItemVariant
} from "@/app/utils/animationConfig";

export const CurrentLocation = () => {
  const { t } = useTranslation();
  const location = t("location.city");
  const locationParts = location.split(",").map((part) => part.trim()).filter(Boolean);

  return (
    <motion.section
      id="location"
      className="mx-auto max-w-4xl w-full mt-10 mb-10 relative px-6"
      variants={fadeInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="absolute -left-16 top-8 pointer-events-none hidden lg:block">
        <motion.img
          alt=""
          src="/circle3.svg"
          className="glass-ornament"
          width="150"
          height="150"
          variants={floatingSlowVariant}
          animate="float"
        />
      </div>

      <div className="absolute -right-12 bottom-10 pointer-events-none hidden lg:block">
        <motion.img
          alt=""
          src="/circle1.svg"
          className="glass-ornament"
          width="110"
          height="110"
          variants={floatingVariant}
          animate="float"
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        variants={staggerContainerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="flex min-w-0 w-full flex-col items-center"
          variants={staggerItemVariant}
        >
          <motion.p
            className="text-sm md:text-base text-gray-500"
            variants={staggerItemVariant}
          >
            {t("location.eyebrow")}
          </motion.p>

          <motion.div
            className="mt-4 flex max-w-2xl flex-wrap justify-center gap-x-3 gap-y-2"
            variants={staggerContainerVariant}
          >
            {locationParts.map((part, index) => {
              const hasNext = index < locationParts.length - 1;
              const sizeClass =
                index === 0
                  ? "text-2xl md:text-4xl"
                  : "text-lg md:text-2xl";

              return (
                <motion.span
                  key={`${part}-${index}`}
                  className={`inline-flex items-center font-heading ${sizeClass} leading-none tracking-tight text-base-content`}
                  variants={staggerItemVariant}
                >
                  {index === 0 && (
                    <span aria-hidden="true" className="mr-2 text-lg md:text-xl leading-none">
                      🇧🇷
                    </span>
                  )}
                  {part}
                  {hasNext ? "," : ""}
                </motion.span>
              );
            })}
          </motion.div>

       
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CurrentLocation;
