var mongoose = require('mongoose')

var attemptSchema = new mongoose.Schema({
  testid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  number_of_correct: Number,
  number_of_incorrect: Number,
  number_of_unanswered: Number,
  score: Number,
  submitted_answers: Array
})

var Attempt = mongoose.model('Attempt', attemptSchema)

module.exports = Attempt
