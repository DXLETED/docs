const { config } = require('dotenv')
const { MongoClient } = require('mongodb')
const faker = require('faker')
const dict = require('../dictionary.json')

config({ path: process.argv.includes('--prod') ? '.env.production' : '.env.development' })
;(async () => {
  const dbClient = new MongoClient(process.env.DB_CONNECT, { useUnifiedTopology: true })
  await dbClient.connect().catch(console.error)
  const db = dbClient.db(process.env.DB_NAME)
  
  const users = (await db.collection('users').find({}).toArray()).map(u => u._id)

  const document = (status, signed, done) => ({
    userId: faker.datatype.boolean() ? users[0].toString() : faker.helpers.randomize(users).toString(),
    status,
    title: faker.name.title(),
    description: faker.lorem.words(20),
    data: {
      fio: `${faker.name.firstName()[0]}${faker.name.middleName()[0].toUpperCase()}${faker.name.lastName()[0]}`,
      dateOfBirth: faker.date.future(30, new Date(0)),
      contacts: {
        phone: faker.phone.phoneNumber('380 ## ### ## ##'),
        email: faker.internet.email()
      },
      skills: [...Array(1 + faker.datatype.number(5))].map(() => faker.lorem.word()),
      workExpirience: [...Array(faker.datatype.number(3))].map(() => ({
        nameOfCompany: faker.company.companyName(),
        occupation: faker.name.jobTitle(),
        description: faker.lorem.words(20)
      }))
    },
    signers: (() => {
      const signersTotal = 1 + faker.datatype.number(10)
      const ready = signed && done ? signersTotal : faker.datatype.number(signersTotal - 1)
      return [...Array(signersTotal)].map((_, i) => ({
        userId: faker.helpers.randomize(users).toString(),
        status: (i + 1) === ready
          ? signed ? dict.signerStatusKey.resolved : dict.signerStatusKey.rejected
          : (i + 1) > ready
            ? done ? dict.signerStatusKey.canceled : dict.signerStatusKey.waiting
            : dict.signerStatusKey.resolved,
        updatedAt: 0,
        ...((i + 1) === ready && !signed
          ? { rejectReason: faker.lorem.words(10) }
          : {}
        )
      }))
    })(),
    createdAt: faker.date.past(1),
    updatedAt: new Date()
  })

  await db.collection('documents').drop()
  await db.collection('documents').insertMany([
    ...[...Array(60)].map(() => document(dict.documentStatusKey.inProgress, true, false)),
    ...[...Array(30)].map(() => document(dict.documentStatusKey.archived, faker.datatype.boolean(), true)),
    ...[...Array(10)].map(() => document(dict.documentStatusKey.rejected, false, true))
  ])
  process.exit()
})()