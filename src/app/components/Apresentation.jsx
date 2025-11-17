"use client";

import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

import { 
  logoRotationVariant, 
  smallCircleRotationVariant,
  mediumCircleRotationVariant,
  slowRotationVariant,
  counterRotationVariant 
} from "@/app/utils/animationConfig";

export const Apresentation = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-7xl flex-wrap items-center justify-between relative py-12">
      <div className="absolute -left-40 top-0 h-full w-80 pointer-events-none">
        <motion.img
          alt="Left Circle Small"
          src="/circle1.svg"
          className="absolute top-10 left-20 opacity-20"
          width="80"
          height="80"
          variants={smallCircleRotationVariant}
          animate="rotate"
          layout="position"
        />
        <motion.img
          alt="Left Circle Medium"
          src="/circle3.svg"
          className="absolute top-40 left-10 opacity-15"
          width="120"
          height="120"
          variants={counterRotationVariant}
          animate="rotate"
          layout="position"
        />
        <motion.img
          alt="Left Circle Large"
          src="/circle2.svg"
          className="absolute top-80 left-0 opacity-20"
          width="160"
          height="160"
          variants={slowRotationVariant}
          animate="rotate"
          layout="position"
        />
        <motion.img
          alt="Left Circle Small 2"
          src="/circle1.svg"
          className="absolute top-72 left-32 opacity-20"
          width="60"
          height="60"
          variants={mediumCircleRotationVariant}
          animate="rotate"
          layout="position"
        />
      </div>
      
      <div className="flex justify-between relative z-10">
        <div className="flex justify-center flex-col ml-10 max-w-[50%]">
          <h1 className="text-3xl font-medium sm:leading-[1.5] text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight font-heading">
            {t("apresentation.greeting")}
          </h1>
          <p className="text-lg font-light leading-relaxed mt-6 text-gray-600 sm:tracking-tight">
            {t("apresentation.subtitle")}
          </p>
        </div>
        <div className="relative flex">
          <motion.img
            alt="Right Circle Large"
            src="/circle2.svg"
            className="absolute inset-y-0 -right-28 opacity-20"
            width="300"
            height="300"
            variants={logoRotationVariant}
            animate="rotate"
            layout="position"
          />
          <motion.img
            alt="Right Circle Medium"
            src="/circle3.svg"
            className="relative inset-y-52 -right-16 md:absolute md:inset-y-80 md:-right-0 opacity-20"
            width="200"
            height="200"
            variants={logoRotationVariant}
            animate="rotate"
            layout="position"
          />
          <motion.img
            alt="Right Circle Main"
            src="/circle1.svg"
            className="inset-y-0 -right-0 m-20 hidden md:block w-80 h-80 lg:w-96 lg:h-96 opacity-80"
            variants={logoRotationVariant}
            animate="rotate"
            layout="position"
          />
        </div>
      </div>
    </div>
  );
};

export default Apresentation;
