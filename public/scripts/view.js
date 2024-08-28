$(() => {
  $('.section-list').on('click', () => {

    $('section.cover').css('z-index', '3');

    setTimeout(() => {
      $('section.cover').css('z-index', '-3');
    }, 10000);
  });


  $('.start').on('click', () => {
    $('.status.failed').css({
      top: '20px',
      display: 'flex'
    });
    $('.status.failed p').text('Sorry, starting a course is coming soon!');

    setTimeout(() => {
      $('.status.failed').fadeOut();
      $('.status.failed').css({
        top: '-70px',
        display: 'none'
      });
    }, 5000);
  });
});