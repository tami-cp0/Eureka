$(() => {
  $('.section-list').on('click', () => {

    $('section.cover').css('z-index', '3');

    setTimeout(() => {
      $('section.cover').css('z-index', '-3');
    }, 10000);
  });
});