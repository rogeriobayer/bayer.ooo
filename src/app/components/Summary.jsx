"use client";

import { motion } from "framer-motion";
import { careerSummary } from "@/app/data/career.server";
import IconWithText from "@/app/components/IconWithText";
import { useTranslation } from "../hooks/useTranslation";
import Image from "next/image";
import {
  fadeInVariant,
  staggerContainerVariant,
  staggerItemVariant
} from "@/app/utils/animationConfig";

export const Summary = () => {
  const career = careerSummary;
  const { t } = useTranslation();

  function calcDaysInCompany() {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs((new Date() - new Date(career.position.startDate)) / oneDay)
    );
    return diffDays;
  }

  const daysInCompany = calcDaysInCompany();

  return (
    <motion.section
      className="mx-auto w-full max-w-7xl mt-20 px-6"
      variants={fadeInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <h2 className="text-2xl md:text-3xl font-medium leading-7 text-center mt-4 text-base-content tracking-tight mb-12 font-heading">
        {t("summary.title")}
      </h2>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-items-center"
        variants={staggerContainerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Education cards - left column */}
        <motion.div
          className="flex flex-col items-center lg:items-end justify-center space-y-6 w-full max-w-sm"
          variants={staggerItemVariant}
        >
          <div className="card bg-base-100/60 backdrop-blur-sm shadow-sm border border-base-300/50 p-5 w-full">
            <div className="card-body p-0">
              <p className="text-base font-light leading-7 text-gray-600">
                {t("education.undergrad.title")}
              </p>
              <p className="text-base font-light leading-7 text-gray-600 mb-3">
                {t("education.undergrad.subtitle")}
              </p>
              <IconWithText value="ufpr" type="company" />
            </div>
          </div>

          <div className="card bg-base-100/60 backdrop-blur-sm shadow-sm border border-base-300/50 p-5 w-full">
            <div className="card-body p-0">
              <p className="text-base font-light leading-7 text-gray-600">
                {t("education.postgrad.title")}
              </p>
              <p className="text-base font-light leading-7 text-gray-600 mb-3">
                {t("education.postgrad.subtitle")}
              </p>
              <IconWithText value="unyleya" type="company" />
            </div>
          </div>
        </motion.div>

        {/* Profile photo - center column */}
        <motion.div
          className="flex justify-center"
          variants={staggerItemVariant}
        >
          <div className="avatar">
            <div className="w-56 md:w-64 rounded-full ring ring-base-content/10 ring-offset-base-100 ring-offset-4 shadow-xl">
              <Image
                alt="Rogério Bayer"
                src="/rogeriobayer.png"
                className="object-cover"
                width="250"
                height="250"
              />
            </div>
          </div>
        </motion.div>

        {/* Current position - right column */}
        <motion.div
          className="flex flex-col justify-center items-center lg:items-start w-full max-w-sm"
          variants={staggerItemVariant}
        >
          <div className="card bg-base-100/60 backdrop-blur-sm shadow-sm border border-base-300/50 p-5 w-full">
            <div className="card-body p-0">
              <p className="text-base font-medium leading-7 text-base-content">
                {t(career.position.nameKey)}
              </p>
              <p className="text-base font-light leading-7 text-gray-600 mb-2">
                {t("summary.daysIn", { days: daysInCompany })}
              </p>
              <IconWithText value={career.position.companyCode} type="company" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Summary;
