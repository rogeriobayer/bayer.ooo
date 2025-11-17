"use client";

import { motion } from "framer-motion";
import { projectsData } from "@/app/data/projects.server";
import IconWithText from "@/app/components/IconWithText";
import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";
import { 
  smallCircleRotationVariant,
  mediumCircleRotationVariant,
  slowRotationVariant,
  counterRotationVariant 
} from "@/app/utils/animationConfig";

export const Projects = () => {
  const projects = projectsData.projects;
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl w-full mt-20 mb-20 relative">
      <div className="absolute -left-20 top-0 h-full w-full pointer-events-none hidden md:block">
        <motion.img
          alt="Left Projects Circle Small"
          src="/circle1.svg"
          className="absolute top-32 -left-16 opacity-80"
          width="90"
          height="90"
          variants={smallCircleRotationVariant}
          animate="rotate"
          layout="position"
        />
        <motion.img
          alt="Right Projects Circle Medium"
          src="/circle3.svg"
          className="absolute top-16 -right-24 opacity-80"
          width="140"
          height="140"
          variants={counterRotationVariant}
          animate="rotate"
          layout="position"
        />
        <motion.img
          alt="Left Projects Circle Large"
          src="/circle2.svg"
          className="absolute top-96 -left-32 opacity-80"
          width="180"
          height="180"
          variants={slowRotationVariant}
          animate="rotate"
          layout="position"
        />
        <motion.img
          alt="Right Projects Circle Small 2"
          src="/circle1.svg"
          className="absolute top-80 -right-8 opacity-80"
          width="70"
          height="70"
          variants={mediumCircleRotationVariant}
          animate="rotate"
          layout="position"
        />
      </div>

      <div className="flex flex-col justify-center items-center relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-medium leading-7 text-center my-8 text-gray-900 sm:tracking-tight font-heading">
            {t("projects.title")}
          </h2>
        </div>

        <div className="flex flex-col items-center sm:w-[33rem] xl:w-full space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="w-full bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-[15%] flex justify-center items-start pt-1">
                  <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                    <Image
                      src={project.image}
                      alt={`${t(project.nameKey)} logo`}
                      className="w-full h-full object-contain"
                      width={120}
                      height={120}
                    />
                  </div>
                </div>
                
                <div className="w-[85%] space-y-3">
                  <h3 className="font-medium text-lg text-gray-900 leading-tight font-heading">
                    {t(project.nameKey)}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.frameworks.map((framework, fIndex) => (
                      <div key={fIndex} className="opacity-80 hover:opacity-100 transition-opacity">
                        <IconWithText value={framework} type="technology" showText={false} />
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {t(project.descriptionKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects; 