"use client";

import { useTranslation } from "../hooks/useTranslation";

export const PageHeader = ({ titleKey, descriptionKey }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-base-content mb-4">
        {t(titleKey)}
      </h1>
      {descriptionKey && (
        <p className="text-lg text-secondary max-w-lg mx-auto">
          {t(descriptionKey)}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
