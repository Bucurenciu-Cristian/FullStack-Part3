
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI;
mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB");
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message);
    });

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3,"short name"],
        required: true,
        unique:true
    },
    number: {
        type: Number,
        minLength: [8 ,"short number"],
        required: true
    },
});
phoneSchema.plugin(uniqueValidator);
phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
module.exports = mongoose.model('Person', phoneSchema);