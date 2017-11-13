var mongoose = require('mongoose')

var questionSchema = new mongoose.Schema({
  testid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  format: {
    type: String,
    required: [true, 'Please select a question format']
  },
  content: String,
  answer: {
    type: String,
    required: [true, 'Please select the correct answer to the question']
  },
  option1: String,
  option2: String,
  option3: String,
  option4: String
})

var Question = mongoose.model('Question', questionSchema)

module.exports = Question
