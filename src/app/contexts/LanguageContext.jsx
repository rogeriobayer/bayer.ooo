"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

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
    try {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        document.documentElement.lang = savedLanguage;
      }
    } catch (e) {
      // localStorage not available
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    try {
      localStorage.setItem('language', newLanguage);
    } catch (e) {
      // localStorage not available
    }
    document.documentElement.lang = newLanguage;
  };

  return (
    <LanguageContext value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext>
  );
};

export default LanguageContext;
