const { Router } = require('express')
const webpush = require('web-push')

webpush.setVapidDetails('mailto:test@example.com', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

module.exports = Router().post('/subscribe', (req, res) => {
  res.sendStatus(201)
  webpush.sendNotification(req.body, JSON.stringify({ title: 'Push notifications with Service Workers' }))
})
