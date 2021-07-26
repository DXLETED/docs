import { useTranslation } from 'react-i18next'

export const useLanguage = () => {
  const { i18n } = useTranslation()
  return (i18n.language || '').slice(0, 2)
}
