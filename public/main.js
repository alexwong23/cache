$(document).ready(function () {
  // Callback to add Spaces in Object Strings
  function addSpaces (target) {
    Object.keys(target).forEach(function (key) {
      if (typeof target[key] === 'string') {
        target[key] = target[key].replace(/_space_/g, ' ')
      }
    })
    return this.target
  }

  // Callback to hide specific textboxes when select question format
  function questionFormatChangeValue () {
    if ($('#format').val() === 'mcq-single-option') {
      $('.options').removeClass('hidden')
    } else {
      $('.options').addClass('hidden')
    }
    if ($('#format').val() === 'true-false') {
      $('.tfanswer').removeClass('hidden')
    } else {
      $('.tfanswer').addClass('hidden')
    }
    if ($('#format').val() === 'open-ended') {
      $('.oeanswer').removeClass('hidden')
    } else {
      $('.oeanswer').addClass('hidden')
    }
  }

  // Used when edit Test
  if ($('.editTest').length) {
    var testData = $('.editTest').data('test')
    addSpaces(testData)
    $('.editTest #description').val(testData.description)
  }

  // Used when Edit Question
  if ($('.editQuestion').length) {
    var questionData = $('.editQuestion').data('question')
    addSpaces(questionData)
    $('.editQuestion #format').val(questionData.format)
    $('.editQuestion #tfanswer').val(questionData.answer)
    $('.editQuestion textarea#content').val(questionData.content)
    $('.editQuestion textarea#oeanswer').val(questionData.answer)
    questionFormatChangeValue()

    $('#format').change(function () {
      questionFormatChangeValue()
    })
  }

  // Used when Create and Edit Question
  if ($('.submitQuestion').length) {
    $('#format').change(function () {
      questionFormatChangeValue()
    })

    // submit form
    $('.submitQuestion').submit(function (e) {
      if ($('#format').val() === 'mcq-single-option') {
        if ($('#option1').val() === '' || $('#option2').val() === '' || $('#option3').val() === '' || $('#option4').val() === '') {
          e.preventDefault()
          alert('Please fill in all the options')
        }
      }
      if ($('#format').val() === 'true-false') {
        if (!$('#tfanswer').val()) {
          e.preventDefault()
          alert('Please select an answer')
        }
      }
      if ($('#format').val() === 'open-ended') {
        if (!$('#oeanswer').val()) {
          e.preventDefault()
          alert('Please fill in the answer')
        }
      }
    })
  }
})
