const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const privateKey = readFileSync('./jwt.key')

const authRequired = (req, res, next) => {
  let decoded
  try {
    decoded = jwt.verify(req.headers.authorization.replace('Bearer ', ''), privateKey, { algorithms: ['RS256'] })
  } catch (e) {
    res.status(401)
    if (e.message === 'jwt expired')
      return res.json({err: 'jwt_expired'})
    else if (e.message === 'invalid token')
      return res.json({err: 'invalid_token'})
    return res.send()
  }
  if (decoded.type !== 'access') return res.sendStatus(401)
  req.auth = { userId: decoded.userId, username: decoded.username }
  next()
}

module.exports = { authRequired }
