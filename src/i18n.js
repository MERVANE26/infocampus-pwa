import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Initialize i18n with language detection and localStorage persistence
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      // Detection order: localStorage first, then navigator language
      order: ['localStorage', 'navigator'],
      // Cache the language selection in localStorage
      caches: ['localStorage'],
      // Supported languages
      lookupLocalStorage: 'app_language',
      // Use the first language code from navigator (e.g., 'fr' from 'fr-FR')
      checkWhitelist: true
    },
    // Supported languages
    supportedLngs: ['en', 'fr'],
    // Load path for additional namespaces (if needed)
    ns: ['translation'],
    defaultNS: 'translation'
  });

// Initialize language on app load
const detectAndSetLanguage = () => {
  const savedLanguage = localStorage.getItem('app_language');
  
  if (savedLanguage) {
    // Use saved language from localStorage
    i18n.changeLanguage(savedLanguage);
  } else {
    // Auto-detect system language
    const browserLanguage = navigator.language || navigator.userLanguage;
    const languageCode = browserLanguage.split('-')[0]; // Get first part (e.g., 'fr' from 'fr-FR')
    
    // Check if the detected language is supported
    const supportedLanguage = ['en', 'fr'].includes(languageCode) ? languageCode : 'en';
    
    // Set the detected language and save it to localStorage
    i18n.changeLanguage(supportedLanguage);
    localStorage.setItem('app_language', supportedLanguage);
  }
};

// Call detection on initialization
detectAndSetLanguage();

export default i18n;

