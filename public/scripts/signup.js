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

  // ensure password is the same as the confirm password field
  $('#confirm, #password').on('input', function() {
    const password = $('#password').val().trim();
    const confirm_password = $('#confirm').val().trim();

    if (password === confirm_password) {
      $('#submit').prop('disabled', false);
      $('#confirm').parent().parent().css('box-shadow', 'none');
    } else {
      $('#submit').prop('disabled', true);
      $('#confirm').parent().parent().css('box-shadow', 'inset 0 0 0 2px red');
    }
  })

  checkInputs();
});