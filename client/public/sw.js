/* eslint-disable no-restricted-globals */

const msgs = {
  en: {
    create: data => `User ${data.user} created a document`,
    sign: data => `User ${data.user} signed the document`,
    reject: data => `User ${data.user} rejected the document`,
    archive: data => `User ${data.user} archived the document`,
  },
  ru: {
    create: data => `Пользователь ${data.user} создал документ`,
    sign: data => `Пользователь ${data.user} подписал документ`,
    reject: data => `Пользователь ${data.user} отклонил документ`,
    archive: data => `Пользователь ${data.user} архивировал документ`,
  },
}

self.addEventListener('push', async event => {
  const params = new URLSearchParams(location.search)
  const res = msgs[params.get('lang') || 'en']
  const data = event.data.json()
  self.registration.showNotification(`Docs | ${data.title}`, {
    body: res[data.type] && res[data.type](data),
    icon: '/favicon.ico',
  })
})
