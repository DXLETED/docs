const { config } = require('dotenv')
const shared = require('./shared')
const { MongoClient } = require('mongodb')
const express = require('express')

config()

;(async () => {
  const dbClient = new MongoClient(process.env.MONGODB, { useUnifiedTopology: true })
  await dbClient.connect().catch(console.error)
  shared.db = dbClient.db('docs')
  
  const app = express()
  
  app
    .use(express.json())
    .use('/api/v1', require('./api'))
    .listen(process.env.PORT)
})()