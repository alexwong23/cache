$(document).ready(function () {
  if ($('.edittest').length) {
    // load form data
    var testdata = $('.edittest').data('test')
    console.log(testdata)
    $('.edittest textarea#description').text(testdata.description)
  }

  if ($('.addQuestion').length) {
    $('#format').change(function () {
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
    })

    // submit form
    $('.addQuestion').submit(function (e) {
      if ($('#format').val() === 'mcq-single-option') {
        if ($('#option1').val() === '' || $('#option2').val() === '' || $('#option3').val() === '' || $('#option4').val() === '') {
          e.preventDefault()
          alert('Please fill in all the options')
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
