const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const Joi = require('joi')
const { authRequired } = require('./middlewares/auth')
const validate = require('./middlewares/validate')
const path = require('path')

const privateKey = readFileSync('./jwt.key')

const refreshTokens = {}

const generateTokens = ({ userId, username }) => {
  const accessToken = jwt.sign({ type: 'access', userId, username }, privateKey, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXP),
      algorithm: 'RS256',
    }),
    refreshToken = jwt.sign({ type: 'refresh', userId, username }, privateKey, {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXP),
      algorithm: 'RS256',
    })
  refreshTokens[userId] = refreshToken
  return { accessToken, refreshToken }
}

module.exports = Router()
  .get('/@me', authRequired, async (req, res) => {
    res.json({ userId: req.auth.userId, username: req.auth.username })
  })
  .get('/blanks', authRequired, async (req, res) => res.sendFile(path.join(__dirname, 'blanks.json')))
  .get('/users', authRequired, async (req, res) =>
    res.json((await db.collection('users').find({}).toArray()).map(u => ({ userId: u._id, username: u.username })))
  )
  .post(
    '/login',
    validate(
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
    ),
    async (req, res) => {
      const user = await db.collection('users').findOne({ username: req.body.username, password: req.body.password })
      if (!user) return res.status(403).json({ err: 'no_user' })
      res.json({
        user: {
          userId: user._id,
          username: user.username,
        },
        ...generateTokens({ userId: user._id, username: user.username }),
      })
    }
  )
  .post(
    '/refresh',
    validate(
      Joi.object({
        refreshToken: Joi.string().required(),
      })
    ),
    async (req, res) => {
      let decoded
      try {
        decoded = jwt.verify(req.body.refreshToken.replace('Bearer ', ''), privateKey, { algorithms: ['RS256'] })
      } catch (e) {
        return res.sendStatus(403)
      }
      if (decoded.type !== 'refresh' || req.body.refreshToken !== refreshTokens[decoded.userId])
        return res.sendStatus(403)
      await new Promise(res => setTimeout(res, parseInt(process.env.REFRESH_DELAY)))
      res.json({
        user: {
          userId: decoded.userId,
          username: decoded.username,
        },
        ...generateTokens({ userId: decoded.userId, username: decoded.username }),
      })
    }
  )
  .post('/documents', authRequired, async (req, res) => {
    const doc = {
      userId: req.auth.userId,
      status: 'IN_PROGRESS',
      title: req.body.title,
      description: req.body.description,
      data: req.body.data,
      signers: req.body.signers.map((userId, i) => ({
        userId,
        status: 'WAITING',
        index: i
      }))
    }
    db.collection('documents').insertOne(doc)
    res.json(doc)
  })
