import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const t = (key, variables = {}) => {
    let translation = translations[currentLanguage]?.[key] || translations['pt']?.[key] || key;
    
    if (typeof translation === 'string' && Object.keys(variables).length > 0) {
      Object.keys(variables).forEach(variable => {
        translation = translation.replace(`{${variable}}`, variables[variable]);
      });
    }
    
    return translation;
  };

  return { t, currentLanguage };
};

export default useTranslation; 