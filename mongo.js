const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  // eslint-disable-next-line no-undef
  process.exit(1)
}
// eslint-disable-next-line no-undef
const password = process.argv[2]

const url = `mongodb+srv://Kicky:${password}@cluster0.bc5jx.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url).then(() => {
  console.log('Conexiunea e buna')
})

const phoneSchema = new mongoose.Schema({
  name: String,
  number: Number,
})
const Person = mongoose.model('Person', phoneSchema)
// eslint-disable-next-line no-undef
if (process.argv.length === 5) {
  const persons = new Person({
    // eslint-disable-next-line no-undef
    name: process.argv[3],
    // eslint-disable-next-line no-undef
    number: process.argv[4],
  })

  persons.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({})
    .then((result) => {
      console.log('phonebook:')
      result.forEach((persons) => {
        console.log(`${persons.name} ${persons.number}`)
      })
      mongoose.connection.close()
      console.log(mongoose)
    })
}
