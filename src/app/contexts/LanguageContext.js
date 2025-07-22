"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'pt';
    setCurrentLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage;
  }, []);

  const changeLanguage = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 