import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enMessages } from './locales/en';
import { uaMessages } from './locales/ua';

const savedLang = localStorage.getItem('lang') ?? 'en';

const resources = {
  en: { translation: enMessages },
  ua: { translation: uaMessages },
};

void i18next.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18next;
