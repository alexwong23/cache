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
  option_1: String,
  option_2: String,
  option_3: String,
  option_4: String
})

var Question = mongoose.model('Question', questionSchema)

module.exports = Question
