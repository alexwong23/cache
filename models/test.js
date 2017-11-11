var mongoose = require('mongoose')

var testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a test name'],
    unique: true
  },
  subject: {
    type: String,
    required: [true, 'Please enter a subject']
  },
  description: String,
  number_of_questions: Number,
  complete: Boolean
})

var Test = mongoose.model('Test', testSchema)

module.exports = Test
