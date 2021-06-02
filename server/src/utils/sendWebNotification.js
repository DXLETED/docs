const webpush = require('web-push')

module.exports = async (rawMsg, exclude) => {
  const msg = JSON.stringify(rawMsg)
  const subs = await db.collection('notificationSubs').find({}, { userId: 1, endpoint: 1, keys: 1 }).toArray()
  subs.filter(sub => sub.userId !== exclude).forEach(sub => webpush.sendNotification(sub, msg))
}
