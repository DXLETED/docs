const { config } = require('dotenv')
const { MongoClient, ObjectID } = require('mongodb')
const faker = require('faker')
const dict = require('../dictionary.json')
const parseDocument = require('../utils/parseDocument')
const blanks = require('../blanks.json')
const moment = require('moment')
const pdf = require('html-pdf')
const path = require('path')
const onlyUnique = require('../utils/onlyUnique')

config({ path: process.argv.includes('--prod') ? '.env.production' : '.env.development' })
;(async () => {
  const dbClient = new MongoClient(process.env.DB_CONNECT, { useUnifiedTopology: true })
  await dbClient.connect().catch(console.error)
  const db = dbClient.db(process.env.DB_NAME)

  const users = (await db.collection('users').find({}).toArray()).map(u => u._id)

  const userId = () => (faker.datatype.boolean() ? users[0].toString() : faker.helpers.randomize(users).toString())

  const fio = () => `${faker.name.firstName()}-${faker.name.lastName()}`

  const skills = () => [...Array(1 + faker.datatype.number(5))].map(() => faker.lorem.word())

  const workExpirience = () =>
    [...Array(faker.datatype.number(3))].map(() => ({
      nameOfCompany: faker.company.companyName(),
      occupation: faker.name.jobTitle(),
      description: faker.lorem.words(20),
    }))

  const signers = (userId, signed, done) => {
    const signersTotal = 1 + faker.datatype.number(10)
    const ready = signed && done ? signersTotal : faker.datatype.number(signersTotal - 1)
    return [...Array(signersTotal)]
      .map(() => faker.helpers.randomize(users).toString())
      .filter(onlyUnique)
      .filter(signerUserId => signerUserId !== userId)
      .map((userId, i) => ({
        userId,
        status: (() => {
          if (i + 1 === ready) return signed ? dict.signerStatusKey.resolved : dict.signerStatusKey.rejected
          if (i + 1 < ready) return dict.signerStatusKey.resolved
          return done ? dict.signerStatusKey.canceled : dict.signerStatusKey.waiting
        })(),
        updatedAt: 0,
        ...(i + 1 === ready && !signed ? { rejectReason: faker.lorem.words(10) } : {}),
      }))
  }

  const document = (status, signed, done) =>
    new Promise(res => {
      const uid = userId()
      const data = {
        fio: fio(),
        dateOfBirth: moment(faker.date.future(30, new Date(0))).format('YYYY-MM-DD'),
        contacts: {
          phone: faker.phone.phoneNumber('380#########'),
          email: faker.internet.email(),
        },
        skills: skills(),
        workExpirience: workExpirience(),
      }
      const doc = {
        _id: new ObjectID(),
        userId: uid,
        blankId: 1,
        status,
        title: faker.name.title(),
        description: faker.lorem.words(20),
        data,
        signers: signers(uid, signed, done),
        rawDocument: parseDocument(blanks.find(b => b.id === 1).template, data),
        createdAt: faker.date.past(1),
        updatedAt: new Date(),
      }
      pdf.create(doc.rawDocument).toFile(path.join(__dirname, '../..', `pdf/${doc._id}.pdf`), () => res(doc))
    })

  const docs = [
    ...(await Promise.all([...Array(60)].map(() => document(dict.documentStatusKey.inProgress, true, false)))),
    ...(await Promise.all(
      [...Array(30)].map(() => document(dict.documentStatusKey.archived, faker.datatype.boolean(), true))
    )),
    ...(await Promise.all([...Array(10)].map(() => document(dict.documentStatusKey.rejected, false, true)))),
  ]

  await db.collection('documents').deleteMany({})
  await db.collection('documents').insertMany(docs)
  process.exit()
})()
