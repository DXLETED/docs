const { config } = require('dotenv')
const shared = require('./shared')
const { MongoClient } = require('mongodb')
const express = require('express')
const path = require('path')

config()

const db = new MongoClient(process.env.MONGODB, { useUnifiedTopology: true })
shared.db = db
db.connect().catch(console.error)

const app = express()

app
  .use('/api/v1', require('./api'))
  .listen(process.env.PORT)