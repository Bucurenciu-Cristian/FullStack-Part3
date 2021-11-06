const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
require('mongoose')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type', {}))
morgan.token('type', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify({
      name: req.body.name,
      number: req.body.number,
    })
  }
  return ''
})
const requestLogger = (request, response, next) => {
  morgan(':method :url :status :res[content-length] - :response-time ms :type')
  next()
}
// const generateId = () => {
//     let number = Math.random() * 10000;
//     return Math.floor(number);
// };
app.post('/api/persons/', requestLogger, (request, response, next) => {
  const { body } = request

  const person = new Person({
    name: body.name,
    number: body.number || false,
  })
  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', ((request, response, next) => {
  const { body } = request
  const person = {
    name: body.name,
    number: Number(body.number),
  }
  Person.findByIdAndUpdate(request.params.id, person, { runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
}))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then((persons) => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then((result) => {
      response.send(`<p>Phonebook has info for ${result.length} people</p><p>${new Date()}</p>`)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknownEndpoint' })
}
app.use(unknownEndpoint)
// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
// eslint-disable-next-line no-undef
const { PORT } = process.env
app.listen(PORT, () => {
  console.log({ PORT })
})
