"use client";

import { motion } from "framer-motion";
import { careerSummary } from "@/app/data/career.server";
import IconWithText from "@/app/components/IconWithText";
import { useTranslation } from "../hooks/useTranslation";
import {
  fadeInVariant,
  staggerContainerVariant,
  staggerItemVariant
} from "@/app/utils/animationConfig";

export const SkillsSummary = () => {
  const career = careerSummary;
  const { t } = useTranslation();

  const renderSkillBadges = (skills) => (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      {skills.map((skill, index) => (
        <motion.div
          key={index}
          className="badge badge-lg badge-ghost gap-2 px-4 py-4 bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-sm hover:shadow-md transition-shadow"
          variants={staggerItemVariant}
        >
          <IconWithText value={skill} type="technology" />
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.section
      className="mx-auto w-full max-w-7xl mt-16 px-6"
      variants={fadeInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        className="flex flex-wrap flex-col justify-evenly gap-10"
        variants={staggerContainerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Languages */}
        <motion.div
          className="flex flex-col justify-center items-center"
          variants={staggerItemVariant}
        >
          <h3 className="text-lg font-normal leading-7 text-center mb-6 text-base-content tracking-tight font-heading">
            {t("skills.languages")}
          </h3>
          {renderSkillBadges(career.skills.languages)}
        </motion.div>

        {/* Frameworks */}
        <motion.div
          className="flex flex-col justify-center items-center"
          variants={staggerItemVariant}
        >
          <h3 className="text-lg font-normal leading-7 text-center mb-6 text-base-content tracking-tight font-heading">
            {t("skills.frameworks")}
          </h3>
          {renderSkillBadges(career.skills.frameworks)}
        </motion.div>

        {/* Tools */}
        <motion.div
          className="flex flex-col justify-center items-center"
          variants={staggerItemVariant}
        >
          <h3 className="text-lg font-normal leading-7 text-center mb-6 text-base-content tracking-tight font-heading">
            {t("skills.tools")}
          </h3>
          {renderSkillBadges(career.skills.tools)}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default SkillsSummary;
