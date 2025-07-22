"use client";

import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'pt', name: 'PT', flag: '🇧🇷' },
  { code: 'en', name: 'EN', flag: '🇺🇸' },
  { code: 'fr', name: 'FR', flag: '🇫🇷' }
];

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
            currentLanguage === lang.code
              ? 'bg-blue-100 text-blue-800 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <span className="text-base">{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector; 