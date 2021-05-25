const { Router } = require('express')
const { authRequired } = require('../middlewares/auth')
const path = require('path')
const dict = require('../dictionary.json')
const { ObjectID } = require('mongodb')
const parseDocument = require('../utils/parseDocument')

const blanks = require('../blanks.json')

const render = (tpl, data) =>
tpl
  .replaceAll(/\$\$([a-zA-Z|.]*)(.*?)\$\$([a-zA-Z|.]*)/g, (_, path, tpl) =>
    objectPath
      .get(data, path)
      .map((el) => render(tpl, el))
      .join('')
  )
  .replaceAll(/\$_/g, data)
  .replaceAll(/\$([a-zA-Z|.]*)/g, (_, path) => objectPath.get(data, path))

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
      rawDocument: parseDocument(blanks[0].template, req.body.data),
      createdAt: new Date(),
      updatedAt: 0,
    }
    await db.collection('documents').insertOne(doc)
    res.json(doc)
  })
  .get('/documents', authRequired, async (req, res) => {
    const from = parseInt(req.query.from) || 0,
      to = parseInt(req.query.to) || 0
    const list = await db
      .collection('documents')
      .find({ signers: { $elemMatch: { userId: req.auth.userId, status: dict.signerStatusKey.waiting } } })
      .toArray()
    res.json({ data: list.slice(from, to), total: list.length })
  })
  .get('/documents/my', authRequired, async (req, res) => {
    const from = parseInt(req.query.from) || 0,
      to = parseInt(req.query.to) || 0
    if (to - from > 10) return res.sendStatus(400)
    const list = await db.collection('documents').find({ userId: req.auth.userId }).toArray()
    res.json({ data: list.slice(from, to), total: list.length })
  })
  .get('/documents/archive', authRequired, async (req, res) => {
    const from = parseInt(req.query.from) || 0,
      to = parseInt(req.query.to) || 0
    const list = await db
      .collection('documents')
      .find({
        status: dict.documentStatusKey.archived,
        $or: [{ userId: req.auth.userId }, { signers: { $elemMatch: { userId: req.auth.userId } } }],
      })
      .toArray()
    res.json({ data: list.slice(from, to), total: list.length })
  })
  .get('/documents/:id', authRequired, async (req, res) => {
    const doc = await db.collection('documents').findOne({ _id: ObjectID(req.params.id) })
    if (!doc) return res.sendStatus(404)
    if (doc.userId !== req.auth.userId && !doc.signers.find(s => s === req.auth.userId)) return res.sendStatus(403)
    res.json(doc)
  })
