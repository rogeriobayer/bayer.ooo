"use client";

import { careerSummary } from "@/app/data/career.server";
import IconWithText from "@/app/components/IconWithText";
import { useTranslation } from "../hooks/useTranslation";
import Image from "next/image";

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
    <>
      <div className="mx-auto w-full max-w-7xl mt-20 px-6">
        <h2 className="text-2xl font-normal leading-7 text-center mt-4 text-gray-900 sm:tracking-tight mb-12 font-heading">
          {t("summary.title")}
        </h2>
        <div className="flex flex-wrap justify-center md:justify-evenly gap-8 items-center lg:gap-4">
          <div className="flex flex-col items-start justify-center order-2 lg:order-1 space-y-6 w-full md:w-auto">
            <div>
              <p className="text-base font-light leading-7 text-gray-600 sm:tracking-tight">
                {t("education.undergrad.title")}
              </p>
              <p className="text-base font-light leading-7 text-gray-600 sm:tracking-tight mb-3">
                {t("education.undergrad.subtitle")}
              </p>
              <IconWithText value="ufpr" type="company" />
            </div>
            <div >
              <p className="text-base font-light leading-7 text-gray-600 sm:tracking-tight">
                {t("education.postgrad.title")}
              </p>
              <p className="text-base font-light leading-7 text-gray-600 sm:tracking-tight mb-3">
                {t("education.postgrad.subtitle")}
              </p>
              <IconWithText value="unyleya" type="company" />
            </div>
          </div>

          <div className="flex justify-center mx-8 lg:mx-20 order-1 lg:order-2">
            <div className="relative">
              <Image
                alt="Rogério Bayer"
                src="/rogeriobayer.png"
                className="object-cover rounded-full shadow-lg border-4 border-white"
                width="250"
                height="250"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/10 to-purple-400/10"></div>
            </div>
          </div>
          <div className="flex flex-col justify-center order-3 items-start w-full md:w-auto mr-0 lg:mr-12"> <p className="text-base font-medium leading-7 mt-3 text-gray-900 sm:tracking-tight">
            {t(career.position.nameKey)}
          </p>
            <p className="text-base font-light leading-7 text-gray-600 sm:tracking-tight mb-2">
              {t("summary.daysIn", { days: daysInCompany })}
            </p>
            <IconWithText value={career.position.companyCode} type="company" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
