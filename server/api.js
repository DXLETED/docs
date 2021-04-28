const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const { db } = require('./shared')

const privateKey = readFileSync('server/jwt.key')

module.exports = Router()
  .get('/@me', (req, res) => zzz)
  .post('/login', (req, res) => {
    //jwt.sign({username: req.body.username, privateKey, { algorithm: 'RS256'})
    zzz
  })
  .post('/registration', (req, res) => zzz)