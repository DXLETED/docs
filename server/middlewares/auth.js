const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const privateKey = readFileSync('./jwt.key')

const authRequired = (req, res, next) => {
  let decoded
  try {
    decoded = jwt.verify(req.headers.authorization.replace('Bearer ', ''), privateKey, { algorithms: ['RS256'] })
  } catch (e) {
    return res.sendStatus(401)
  }
  if (decoded.type !== 'access') return res.sendStatus(401)
  console.log(decoded)
  req.auth = { userId: decoded.userId, username: decoded.username }
  next()
}

module.exports = { authRequired }