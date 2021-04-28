const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { readFileSync } = require('fs')
const { db } = require('./shared')

const privateKey = readFileSync('server/jwt.key', { algorithm: 'RS256'})

module.exports = Router()
  .get('/@me', (req, res) => zzz)
  .get('/login', (req, res) => zzz)
  .get('/registration', (req, res) => zzz)