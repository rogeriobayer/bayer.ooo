"use client";

import { careerSummary } from "@/app/data/career.server";
import IconWithText from "@/app/components/IconWithText";
import { useTranslation } from "../hooks/useTranslation";

export const SkillsSummary = () => {
  const career = careerSummary;
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-7xl mt-16 px-6">
      <div className="flex flex-wrap flex-col justify-evenly gap-8">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold leading-7 text-center my-6 text-gray-900 sm:tracking-tight">
            {t("skills.languages")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
            {career.skills.languages.map((language, index) => (
              <div
                key={index}
                className="flex justify-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
              >
                <IconWithText value={language} type="technology" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold leading-7 text-center my-6 text-gray-900 sm:tracking-tight">
            {t("skills.frameworks")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
            {career.skills.frameworks.map((framework, index) => (
              <div
                key={index}
                className="flex justify-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
              >
                <IconWithText value={framework} type="technology" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold leading-7 text-center my-6 text-gray-900 sm:tracking-tight">
            {t("skills.tools")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
            {career.skills.tools.map((tool, index) => (
              <div
                key={index}
                className="flex justify-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
              >
                <IconWithText value={tool} type="technology" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSummary;
