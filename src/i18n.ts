import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    gopainter: {
      title: 'GoPainter'
    }
  },
  zh: {
    gopainter: {
      title: 'GoPainter'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: navigator.language.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages
})
