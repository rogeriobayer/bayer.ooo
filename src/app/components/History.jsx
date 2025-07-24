"use client";

import { motion } from "framer-motion";
import { careerSummary } from "@/app/data/career.server";
import IconWithText from "@/app/components/IconWithText";
import { useTranslation } from "../hooks/useTranslation";
import {
  slowRotationVariant,
  counterRotationVariant,
} from "@/app/utils/animationConfig";

export const SkillsSummary = () => {
  const career = careerSummary;
  const { t } = useTranslation();

  const getDateText = (startDate, endDate) => {
    const endText = endDate ? `${endDate}` : t("history.current");
    return `${startDate} - ${endText}`;
  };

  return (
    <div className="mx-auto max-w-3xl w-full mt-10 relative">
      <div className="absolute -left-96 top-20 pointer-events-none">
        <motion.img
          alt="Left History Circle"
          src="/circle2.svg"
          width="300"
          height="300"
          variants={slowRotationVariant}
          animate="rotate"
          layout="position"
        />
      </div>

      <div className="absolute md:-right-72 -right-60 top-80 pointer-events-none">
        <motion.img
          alt="Right History Circle"
          src="/circle1.svg"
          width="300"
          height="300"
          variants={counterRotationVariant}
          animate="rotate"
          layout="position"
        />
      </div>

      <div className="flex flex-wrap flex-col justify-evenly gap-4 relative z-10">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold leading-7 text-center my-8 text-gray-900 sm:tracking-tight">
            {t("history.title")}
          </h2>
          <div className="flex flex-col items-center sm:w-[33rem] xl:w-full space-y-8">
            {career.history.map((experience, index) => (
              <div
                key={index}
                className="w-full bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="w-[25%] flex-shrink-0">
                    <span className="text-sm font-medium text-gray-500 xl:bg-gray-50 xl:px-3 xl:py-1.5 rounded-full">
                      {getDateText(experience.startDate, experience.endDate)}
                    </span>
                  </div>

                  <div className="w-[75%] space-y-4">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                      {t(experience.positionKey)}
                    </h3>

                    <div className="flex items-center">
                      <IconWithText
                        value={experience.companyCode}
                        type="company"
                        className="text-base"
                      />
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed font-light">
                      {t(experience.descriptionKey)}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {experience.technologies.map((tech, techIndex) => (
                        <div
                          key={techIndex}
                          className="opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <IconWithText
                            value={tech}
                            type="technology"
                            showText={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSummary;
