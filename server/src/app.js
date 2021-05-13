const { config } = require('dotenv')
const { MongoClient } = require('mongodb')
const express = require('express')
const cors = require('cors')

config({ path: process.argv.includes('--prod') ? '.env.production' : '.env.development' })
;(async () => {
  const dbClient = new MongoClient(process.env.DB_CONNECT, { useUnifiedTopology: true })
  await dbClient.connect().catch(console.error)
  global.db = dbClient.db(process.env.DB_NAME)

  const app = express()

  app.use(cors()).use(express.json()).use('/api/v1', require('./api')).listen(process.env.PORT)
})()
