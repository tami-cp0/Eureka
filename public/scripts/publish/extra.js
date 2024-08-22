// EXTRAS
$(() => {
  // show or hide section option
  $('.add').on('click', () => {
    const option = $('.option');

    if (option.hasClass('show')) {
      option.css('opacity', '0');
      option.removeClass('show').addClass('hide');
    } else {
      option.css('opacity', '1');
      option.fadeIn(); // Correct method for showing
      option.removeClass('hide').addClass('show');
    } 
  });

  $('.option').on('click', function() {
    $('.option').fadeOut();
    $('.option').removeClass('show').addClass('hide');
  })

  // show or hide info section
  $('.info-section article > div').on('click', function() {
    if ($(this).hasClass('hide')) {
      $(this).css('bottom', '95%');
      $('.course-details').css('bottom', '93%');
      $(this).children().css('transform', 'rotate(180deg)');

      $(this).removeClass('hide').addClass('show');
    } else {
      $(this).css('bottom', '0');
      $('.course-details').css('bottom', '0');
      $(this).children().css('transform', 'none');

      $(this).removeClass('show').addClass('hide');
    }
  });

  // show the image name after clicking add course image
    $('#image').on('change', function() {
      var fileName = $(this).get(0).files.length > 0 ? $(this).get(0).files[0].name : 'No file chosen';
      $('#file-name').text(fileName);
      $('#button-text').text('Change course image');
  });
});
