const msgs = {
  create: data => `Пользователь ${data.user} создал документ`,
  sign: data => `Пользователь ${data.user} подписал документ`,
  reject: data => `Пользователь ${data.user} отклонил документ`,
  archive: data => `Пользователь ${data.user} архивировал документ`
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', event => {
  const data = event.data.json();
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(data.title, {
    body: msgs[data.type] && msgs[data.type](data),
  });
});