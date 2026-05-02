"use client";

import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'pt', flag: '🇧🇷' },
  { code: 'en', flag: '🇺🇸' },
  { code: 'fr', flag: '🇫🇷' }
];

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`p-2 rounded-lg text-base transition-all duration-200 ${
            currentLanguage === lang.code
              ? 'bg-blue-100 shadow-sm dark:bg-blue-900/40'
              : 'hover:bg-base-200'
          }`}
          aria-label={`Change language to ${lang.code}`}
        >
          <span>{lang.flag}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector; 