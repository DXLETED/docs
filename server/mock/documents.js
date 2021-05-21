const { config } = require('dotenv')
const { MongoClient } = require('mongodb')
const faker = require('faker')

config({ path: process.argv.includes('--prod') ? '.env.production' : '.env.development' })
;(async () => {
  const dbClient = new MongoClient(process.env.DB_CONNECT, { useUnifiedTopology: true })
  await dbClient.connect().catch(console.error)
  const db = dbClient.db(process.env.DB_NAME)
  
  const users = (await db.collection('users').find({}).toArray()).map(u => u._id)

  const document = (status, signed, done) => ({
    userId: faker.helpers.randomize(users).toString(),
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
          ? signed ? 'SIGNED' : 'REJECTED'
          : (i + 1) > ready
            ? done ? 'CANCELED' : 'WAITING'
            : 'SIGNED'
      }))
    })()
  })

  await db.collection('documents').drop()
  await db.collection('documents').insertMany([
    ...[...Array(60)].map(() => document('IN_PROGRESS', true, false)),
    ...[...Array(30)].map(() => document('ARCHIVED', faker.datatype.boolean(), true)),
    ...[...Array(10)].map(() => document('REJECTED', false, true))
  ])
  process.exit()
})()