"use client";

import { motion } from "framer-motion";
import { careerSummary } from "@/app/data/career.server";
import IconWithText from "@/app/components/IconWithText";
import { useTranslation } from "../hooks/useTranslation";
import {
  floatingVariant,
  floatingSlowVariant,
  fadeInVariant,
  staggerContainerVariant,
  staggerItemVariant
} from "@/app/utils/animationConfig";

export const History = () => {
  const career = careerSummary;
  const { t } = useTranslation();

  const getDateText = (startDate, endDate) => {
    const endText = endDate ? `${endDate}` : t("history.current");
    return `${startDate} - ${endText}`;
  };

  return (
    <motion.section
      className="mx-auto max-w-4xl w-full mt-16 relative px-6"
      variants={fadeInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Decorative circles with glass effect */}
      <div className="absolute -left-80 top-20 pointer-events-none hidden xl:block">
        <motion.img
          alt=""
          src="/circle2.svg"
          width="250"
          height="250"
          className="glass-ornament"
          variants={floatingSlowVariant}
          animate="float"
        />
      </div>

      <div className="absolute -right-72 top-96 pointer-events-none hidden xl:block">
        <motion.img
          alt=""
          src="/circle1.svg"
          width="220"
          height="220"
          className="glass-ornament"
          variants={floatingVariant}
          animate="float"
        />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-medium leading-7 text-center my-10 text-base-content tracking-tight font-heading">
          {t("history.title")}
        </h2>

        {/* DaisyUI Timeline */}
        <motion.ul
          className="timeline timeline-snap-icon timeline-vertical max-md:timeline-compact"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {career.history.map((experience, index) => (
            <motion.li key={index} variants={staggerItemVariant}>
              {index > 0 && <hr className="bg-base-300" />}

              {/* Timeline marker */}
              <div className="timeline-middle">
                <div className="w-4 h-4 rounded-full bg-primary shadow-md"></div>
              </div>

              {/* Alternating sides for desktop */}
              <div className={`timeline-${index % 2 === 0 ? 'start' : 'end'} mb-10 ${index % 2 === 0 ? 'md:text-end' : ''}`}>
                {/* Date badge */}
                <time className="badge badge-ghost badge-sm font-mono mb-2">
                  {getDateText(experience.startDate, experience.endDate)}
                </time>

                {/* Experience card */}
                <div className="card bg-base-100/70 backdrop-blur-sm shadow-sm border border-base-300/50 hover:shadow-lg transition-shadow duration-300">
                  <div className="card-body p-5">
                    {/* Position title */}
                    <h3 className="card-title text-lg font-heading text-base-content">
                      {t(experience.positionKey)}
                    </h3>

                    {/* Company */}
                    <div className={`flex items-center gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <IconWithText
                        value={experience.companyCode}
                        type="company"
                        className="text-sm"
                      />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed font-light mt-2">
                      {t(experience.descriptionKey)}
                    </p>

                    {/* Tech stack - styled like SkillsSummary badges */}
                    <div className={`flex flex-wrap gap-1.5 my-1 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {experience.technologies.map((tech, techIndex) => (
                        <div
                          key={techIndex}
                          className="badge badge-sm badge-ghost gap-1 px-2 py-2.5"
                        >
                          <IconWithText
                            value={tech}
                            type="technology"
                            showText={false}
                            showTooltip
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {index < career.history.length - 1 && <hr className="bg-base-300" />}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
};

export default History;
