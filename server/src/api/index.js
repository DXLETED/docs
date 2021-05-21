const { Router } = require('express')
const { authRequired } = require('../middlewares/auth')
const path = require('path')
const dict = require('../dictionary.json')

module.exports = Router()
  .use('/auth', require('./auth'))
  .get('/blanks', authRequired, async (req, res) => res.sendFile(path.join(__dirname, '../blanks.json')))
  .get('/users', authRequired, async (req, res) =>
    res.json((await db.collection('users').find({}).toArray()).map(u => ({ userId: u._id, username: u.username })))
  )
  .post('/documents', authRequired, async (req, res) => {
    const doc = {
      userId: req.auth.userId,
      status: dict.documentStatusKey.inProgress,
      title: req.body.title,
      description: req.body.description,
      data: req.body.data,
      signers: req.body.signers.map(userId => ({
        userId,
        status: dict.signerStatusKey.waiting,
      })),
      createdAt: new Date(),
      updatedAt: 0
    }
    await db.collection('documents').insertOne(doc)
    res.json(doc)
  })
  .get('/documents', authRequired, async (req, res) =>
    res.json(
      await db
        .collection('documents')
        .find({ signers: { $elemMatch: { userId: req.auth.userId, status: dict.signerStatusKey.waiting } } })
        .toArray()
    )
  )
  .get('/documents/my', authRequired, async (req, res) =>
    res.json(await db.collection('documents').find({ userId: req.auth.userId }).toArray())
  )
  .get('/documents/archive', authRequired, async (req, res) =>
    res.json(
      await db
        .collection('documents')
        .find({
          status: dict.documentStatusKey.archived,
          $or: [{ userId: req.auth.userId }, { signers: { $elemMatch: { userId: req.auth.userId } } }],
        })
        .toArray()
    )
  )
