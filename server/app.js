const { config } = require('dotenv')
const { MongoClient } = require('mongodb')
const express = require('express')
const cors = require('cors')

config()
;(async () => {
  const dbClient = new MongoClient(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`,
    { useUnifiedTopology: true }
  )
  await dbClient.connect().catch(console.error)
  global.db = dbClient.db(process.env.DB_DBNAME)

  const app = express()

  app.use(cors()).use(express.json()).use('/api/v1', require('./api')).listen(process.env.PORT)
})()
