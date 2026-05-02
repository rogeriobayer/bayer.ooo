/**
 * Format date for display
 * @param {string} dateString
 * @param {string} lang
 * @returns {string}
 */
export function formatDate(dateString, lang = 'pt') {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  const localeMap = {
    pt: 'pt-BR',
    en: 'en-US',
    fr: 'fr-FR',
  };

  return date.toLocaleDateString(localeMap[lang] || 'pt-BR', options);
}
