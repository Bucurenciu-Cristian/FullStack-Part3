const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type',{}));
morgan.token('type', (req, res) => {
    if (req.method === "POST") {
        return JSON.stringify({
            name: req.body.name,
            number: req.body.number
        });
    } else {
        return "";
    }
})

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];
const generateId = () => {
    let number = Math.random() * 10000;
    return Math.floor(number);
};
app.get('/api/persons', (request, response) => {
    response.json(persons);
});
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();

});
const requestLogger = (request, response, next) => {
    morgan(":method :url :status :res[content-length] - :response-time ms :type")
    next()
}
app.post('/api/persons/', requestLogger,(request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number isn't specified"
        });
    }
    const namePerson = body.name;
    const findPerson = persons.find(person => person.name === namePerson);
    if (findPerson) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number || false,
    };
    persons = persons.concat(person);
    response.json(person);
});
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
})