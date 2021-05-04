const { config } = require('dotenv')
const shared = require('./shared')
const { MongoClient } = require('mongodb')
const express = require('express')

config()
;(async () => {
  const dbClient = new MongoClient(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`,
    { useUnifiedTopology: true }
  )
  await dbClient.connect().catch(console.error)
  shared.db = dbClient.db(process.env.DB_DBNAME)

  const app = express()

  app.use(express.json()).use('/api/v1', require('./api')).listen(process.env.PORT)
})()
