const { Router } = require('express')
const webpush = require('web-push')
const { authRequired } = require('../middlewares/auth')

webpush.setVapidDetails('mailto:test@example.com', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

module.exports = Router()
  .post('/subscribe', authRequired, async (req, res) => {
    res.sendStatus(201)
    await db
      .collection('notificationSubs')
      .updateOne({ userId: req.auth.userId }, { $set: { userId: req.auth.userId, ...req.body } }, { upsert: true })
    webpush.sendNotification(req.body, JSON.stringify({ title: 'Test' }))
  })
  .post('/unsubscribe', authRequired, async (req, res) => {
    res.sendStatus(201)
    await db.collection('notificationSubs').deleteOne({ userId: req.auth.userId })
  })
