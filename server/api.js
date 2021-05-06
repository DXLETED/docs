const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const { db } = require('./shared')
const Joi = require('joi')
const { authRequired } = require('./middlewares/auth')
const validate = require('./middlewares/validate')

const privateKey = readFileSync('./jwt.key')

const refreshTokens = {}

const generateTokens = ({ userId, username }) => {
  const accessToken = jwt.sign({ type: 'access', userId, username }, privateKey, {
      expiresIn: 180,
      algorithm: 'RS256',
    }),
    refreshToken = jwt.sign({ type: 'refresh', userId, username }, privateKey, { algorithm: 'RS256' })
  refreshTokens[userId] = refreshToken
  return { accessToken, refreshToken }
}

module.exports = Router()
  .get('/@me', authRequired, async (req, res) => {
    res.json({ userId: req.auth.userId, username: req.auth.username })
  })
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
      if (!user) return res.sendStatus(401)
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
    (req, res) => {
      let decoded
      try {
        decoded = jwt.verify(req.body.refreshToken.replace('Bearer ', ''), privateKey, { algorithms: ['RS256'] })
      } catch (e) {
        return res.sendStatus(403)
      }
      if (decoded.type !== 'refresh' || req.body.refreshToken !== refreshTokens[decoded.userId])
        return res.sendStatus(403)
      res.json({
        user: {
          userId: user._id,
          username: user.username,
        },
        ...generateTokens({ userId: decoded.userId, username: decoded.username }),
      })
    }
  )
