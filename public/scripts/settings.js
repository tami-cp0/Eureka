$(() => {
  // hide or show settings
  $('.settings img').on('click', function() {
    // get the input tag realated to the object clicked.
    const settings = $(this).parent();

    if ($(settings).hasClass('hide')) {
      $(settings).removeClass('hide').addClass('show').css('display', 'none');
      $('.settingsBtn').css('font-weight', 200);
    }
  });

  $('.settingsBtn').on('click', function() {

    const settings = $('.settings');
    if ($(settings).hasClass('hide')) {
      $(settings).removeClass('hide').addClass('show').css('display', 'none');
      $(this).css('font-weight', 200);
    } else {
      $(settings).removeClass('show').addClass('hide').css('display', 'flex');
      $(this).css('font-weight', 700);
    }
  });
});