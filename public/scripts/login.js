$(() => {
  // hide or show password
  $('.credential #eye').on('click', function() {
    // get the input tag realated to the object clicked.
    const input = $(this).siblings('.password').children('input');

    if ($(this).hasClass('hide')) {
      $(this).removeClass('hide').addClass('show').attr('src', '../public/images/openeye.svg');

      $(input).attr('type', 'text');
    } else {
      $(this).removeClass('show').addClass('hide').attr('src', '../public/images/closedeye.svg');

      $(input).attr('type', 'password');
    }
  });

  function checkInputs() {
    // Check if all input fields in the form have values
    const allFilled = $('form input').toArray().every(input => $(input).val().trim() !== '');
    
    // Enable or disable the submit button based on the inputs
    $('#submit').prop('disabled', !allFilled);
    if (allFilled) {
      $('#submit').css('border', 'none');
    }
  }

  // Add event listeners to check inputs when they change
  $('form input').on('input', checkInputs);
  $('#submit').on('mouseenter', function() {
    if ($(this).prop('disabled')) {
      $(this).css('border', '2px solid red');
    }
  });

  checkInputs();
});