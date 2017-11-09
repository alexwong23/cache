var mongoose = require('mongoose')

var resultSchema = new mongoose.Schema({
  testid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  number_of_correct: Number,
  number_of_incorrect: Number,
  number_of_unanswered: Number,
  score: Number
})

var Result = mongoose.model('Result', resultSchema)

module.exports = Result
