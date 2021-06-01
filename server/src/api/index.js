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
  if (!doc) throw { code: 404, err: 'no_document' }
  if (doc.userId !== auth.userId && !doc.signers.find(s => s.userId === auth.userId)) throw { code: 403, err: 'document_no_access' }
  return doc
}

const limitRequest = (req, maxLen) => {
  const from = parseInt(req.query.from) || 0,
    to = parseInt(req.query.to) || 0
  if (to - from > maxLen) throw { code: 400 }
  return [from, to]
}

module.exports = Router()
  .use('/auth', require('./auth'))

  .get('/blanks', authRequired, async (req, res) => res.sendFile(path.join(__dirname, '../blanks.json')))

  .get('/status', authRequired, async (req, res) =>
    res.json({
      newDocuments: await db.collection('documents').countDocuments({
        signers: { $elemMatch: { userId: req.auth.userId, status: dict.signerStatusKey.waiting } },
      }),
      myDocuments: await db.collection('documents').countDocuments({
        userId: req.auth.userId,
      }),
      notifications: (
        await db.collection('notifications').find({ users: req.auth.userId }).sort({ date: -1 }).toArray()
      ).map(el => ({
        type: el.type,
        document: el.document,
        userId: el.userId,
        date: el.date,
      })),
    })
  )

  .get('/users', authRequired, async (req, res) =>
    res.json((await db.collection('users').find({}).toArray()).map(u => ({ userId: u._id, username: u.username })))
  )

  .post('/documents', authRequired, async (req, res) => {
    const doc = {
      _id: ObjectID(),
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
      rawDocument: parseDocument(blanks.find(b => b.id === req.body.blankId)?.template || '', req.body.data),
      createdAt: new Date(),
      updatedAt: 0,
    }
    const d = await db.collection('documents').insertOne(doc)
    await db.collection('notifications').insertOne({
      type: 'CREATE',
      userId: req.auth.userId,
      document: {
        id: doc._id.toString(),
        title: doc.title,
      },
      date: new Date(),
      users: doc.signers.map(s => s.userId),
    })
    pdf
      .create(`<div style="font-family: sans-serif">${doc.rawDocument}</div>`)
      .toFile(`pdf/${d.insertedId}.pdf`, err => {
        err && console.log(err)
        res.json(doc)
      })
  })

  .get('/documents', authRequired, async (req, res) => {
    let from, to
    try {
      ;[from, to] = limitRequest(req, 10)
    } catch (e) {
      return res.sendStatus(400)
    }
    const statusFilter = Object.entries(JSON.parse(req.query.statusFilter))
      .filter(el => el[1])
      .map(el => el[0])
    const onlyWaiting = JSON.parse(req.query.onlyWaiting)
    let list = await db
      .collection('documents')
      .find({
        ...(req.query.search ? { title: new RegExp(`.*${req.query.search}.*`) } : {}),
        ...(statusFilter.length ? { status: { $in: statusFilter } } : {}),
        signers: { $elemMatch: { userId: req.auth.userId, status: dict.signerStatusKey.waiting } },
      })
      .sort({ createdAt: -1 })
      .toArray()
    if (onlyWaiting)
      list = list.filter(doc => doc.signers.find(s => s.status === 'WAITING')?.userId === req.auth.userId)
    res.json({ data: list.slice(from, to), total: list.length })
  })

  .get('/documents/my', authRequired, async (req, res) => {
    let from, to
    try {
      ;[from, to] = limitRequest(req, 10)
    } catch (e) {
      return res.sendStatus(400)
    }
    const statusFilter = Object.entries(JSON.parse(req.query.statusFilter))
      .filter(el => el[1])
      .map(el => el[0])
    const list = await db
      .collection('documents')
      .find({
        ...(req.query.search ? { title: new RegExp(`.*${req.query.search}.*`) } : {}),
        ...(statusFilter.length ? { status: { $in: statusFilter } } : {}),
        userId: req.auth.userId,
      })
      .sort({ createdAt: -1 })
      .toArray()
    res.json({ data: list.slice(from, to), total: list.length })
  })

  .get('/documents/archive', authRequired, async (req, res) => {
    let from, to
    try {
      ;[from, to] = limitRequest(req, 10)
    } catch (e) {
      return res.sendStatus(400)
    }
    const statusFilter = Object.entries(JSON.parse(req.query.statusFilter))
      .filter(el => el[1])
      .map(el => el[0])
    const list = await db
      .collection('documents')
      .find({
        ...(req.query.search ? { title: new RegExp(`.*${req.query.search}.*`) } : {}),
        ...(statusFilter.length ? { status: { $in: statusFilter } } : {}),
        status: dict.documentStatusKey.archived,
        $or: [{ userId: req.auth.userId }, { signers: { $elemMatch: { userId: req.auth.userId } } }],
      })
      .sort({ createdAt: -1 })
      .toArray()
    res.json({ data: list.slice(from, to), total: list.length })
  })

  .get('/documents/:id', authRequired, async (req, res) => {
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.status(e.code).json({err: e.err})
    }
    res.json(doc)
  })

  .get('/documents/:id/pdf', authRequired, async (req, res) => {
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.status(e.code).json({err: e.err})
    }
    res.sendFile(path.join(__dirname, '../..', `pdf/${doc._id}.pdf`))
  })

  .post('/documents/:id/resolve', authRequired, async (req, res) => {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.auth.userId) })
    if (!user || req.body.password !== user.password) return res.status(400).json({ err: 'invalid_password' })
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.status(e.code).json({err: e.err})
    }
    const currentSigner = doc?.signers.find(
      (s, i, signers) => s.status === 'WAITING' && !signers.slice(0, i).some(s => s.status === 'WAITING')
    )
    if (currentSigner?.userId !== req.auth.userId) return res.sendStatus(403)
    currentSigner.status = 'RESOLVED'
    currentSigner.updatedAt = new Date()
    if (doc.signers.every(s => s.status === 'RESOLVED')) doc.status = 'RESOLVED'
    doc.updatedAt = new Date()
    await db.collection('documents').updateOne({ _id: doc._id }, { $set: doc })
    await db.collection('notifications').insertOne({
      type: 'SIGN',
      userId: req.auth.userId,
      document: {
        id: doc._id.toString(),
        title: doc.title,
      },
      date: new Date(),
      users: [doc.userId, ...doc.signers.map(s => s.userId)].filter(u => u !== req.auth.userId),
    })
    res.json(doc)
  })

  .post('/documents/:id/reject', authRequired, async (req, res) => {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.auth.userId) })
    if (!user || req.body.password !== user.password) return res.status(400).json({ err: 'invalid_password' })
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.status(e.code).json({err: e.err})
    }
    const currentSigner = doc?.signers.find(
      (s, i, signers) => s.status === 'WAITING' && !signers.slice(0, i).some(s => s.status === 'WAITING')
    )
    if (currentSigner?.userId !== req.auth.userId) return res.sendStatus(403)
    currentSigner.status = 'REJECTED'
    currentSigner.updatedAt = new Date()
    currentSigner.rejectReason = req.body.rejectReason
    doc.signers = doc.signers.map(s => (s.status === 'WAITING' ? { ...s, status: 'CANCELED' } : s))
    doc.status = 'REJECTED'
    doc.updatedAt = new Date()
    await db.collection('documents').updateOne({ _id: doc._id }, { $set: doc })
    await db.collection('notifications').insertOne({
      type: 'REJECT',
      userId: req.auth.userId,
      document: {
        id: doc._id.toString(),
        title: doc.title,
      },
      date: new Date(),
      users: [doc.userId, ...doc.signers.map(s => s.userId)].filter(u => u !== req.auth.userId),
    })
    res.json(doc)
  })

  .post('/documents/:id/archive', authRequired, async (req, res) => {
    let doc
    try {
      doc = await getDocument(req.params.id, req.auth)
    } catch (e) {
      return res.status(e.code).json({err: e.err})
    }
    if (doc.signers.some(s => s.status === 'WAITING')) return res.sendStatus(400)
    doc.status = 'ARCHIVED'
    doc.updatedAt = new Date()
    await db.collection('documents').updateOne({ _id: doc._id }, { $set: doc })
    await db.collection('notifications').insertOne({
      type: 'ARCHIVE',
      userId: req.auth.userId,
      document: {
        id: doc._id.toString(),
        title: doc.title,
      },
      date: new Date(),
      users: doc.signers.map(s => s.userId),
    })
    res.json(doc)
  })
