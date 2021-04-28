const { config } = require('dotenv')
config()

const shared = require('./shared')

const { MongoClient } = require('mongodb')
const db = new MongoClient(process.env.MONGODB, { useUnifiedTopology: true })
shared.db = db

db.connect().catch(console.error)

const express = require('express')
const app = express()

app
  .use('/api/v1', require('./api'))
  .use('/dist/', express.static('dist/'))
  .use('/static/', express.static('static/'))
  .get('*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')))
  .listen(process.env.PORT)