const { Router } = require('express')
const { authRequired } = require('../middlewares/auth')
const path = require('path')
const dict = require('../dictionary.json')
const { ObjectID } = require('mongodb')
const parseDocument = require('../utils/parseDocument')
const pdf = require('html-pdf')

const blanks = require('../blanks.json')

const getDocument = async (id, auth) => {
  const doc = await db.collection('documents').findOne({ _id: ObjectID(id) })
  if (!doc) throw Error({ code: 404 })
  if (doc.userId !== auth.userId && !doc.signers.find(s => s.userId === auth.userId)) throw Error({ code: 403 })
  return doc
}

const render = (tpl, data) =>
  tpl
    .replaceAll(/\$\$([a-zA-Z|.]*)(.*?)\$\$([a-zA-Z|.]*)/g, (_, path, tpl) =>
      objectPath
        .get(data, path)
        .map(el => render(tpl, el))
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
      blankId: req.body.blankId,
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
    const d = await db.collection('documents').insertOne(doc)
    pdf.create(doc.rawDocument).toFile(`pdf/${d.insertedId}.pdf`, err => {
      err && console.log(err)
      res.json(doc)
    })
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
    if (doc.userId !== req.auth.userId && !doc.signers.find(s => s.userId === req.auth.userId))
      return res.sendStatus(403)
    res.json(doc)
  })
  .get('/documents/:id/pdf', authRequired, async (req, res) => {
    const doc = await db.collection('documents').findOne({ _id: ObjectID(req.params.id) })
    if (!doc) return res.sendStatus(404)
    if (doc.userId !== req.auth.userId && !doc.signers.find(s => s.userId === req.auth.userId))
      return res.sendStatus(403)
    res.sendFile(path.join(__dirname, '../..', `pdf/${doc._id}.pdf`))
  })
  .post('/documents/:id/resolve', authRequired, async (req, res) => {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.auth.userId) })
    if (!user || req.body.password !== user.password) return res.sendStatus(400)
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.sendStatus(e.code)
    }
    doc.signers = doc.signers.map(s =>
      s.userId === req.auth.userId ? { ...s, status: 'RESOLVED', updatedAt: new Date() } : s
    )
    await db.collection('documents').updateOne({ _id: doc._id }, { $set: doc })
    res.json(doc)
  })
  .post('/documents/:id/reject', authRequired, async (req, res) => {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.auth.userId) })
    if (!user || req.body.password !== user.password) return res.sendStatus(400)
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.sendStatus(e.code)
    }
    doc.signers = doc.signers.map(s => {
      if (s.userId === req.auth.userId)
        return { ...s, status: 'REJECTED', updatedAt: new Date(), rejectReason: req.body.rejectReason }
      if (s.status === 'WAITING') return { ...s, status: 'CANCELED' }
      return s
    })
    doc.status = 'REJECTED'
    await db.collection('documents').updateOne({ _id: doc._id }, { $set: doc })
    res.json(doc)
  })
  .post('/documents/:id/archive', authRequired, async (req, res) => {
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.sendStatus(e.code)
    }
    if (doc.signers.some(s => s.status === 'WAITING'))
      return res.sendStatus(400)
    doc.status = 'ARCHIVED'
    await db.collection('documents').updateOne({ _id: doc._id }, { $set: doc })
    res.json(doc)
  })
