import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import locale from '../public/locales/en/translation.json'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: { escapeValue: false },
    react: { wait: true, useSuspense: false },
  })

declare module 'react-i18next' {
  interface Resources {
    [key: string]: typeof locale
  }
}

export default i18n