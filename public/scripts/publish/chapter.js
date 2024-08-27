window.count = 1; // track chapter and quiz order
$(window).on('load', function() {
  $('.preloader').stop(true, true).css({
      'display': 'flex',
      'opacity': '1'
  });
});

// quill editor
$(() => {
  window.quillEditors = {}; // Object to store all Quill editor instances


  // Function to initialize a Quill editor for a given chapter
  function initializeQuillEditor(chapterNumber, content = null) {
    const quill = new Quill(`#editor-${chapterNumber}`, {
      modules: {
        toolbar: [
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic'],
          ['link', 'blockquote', 'code-block', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
      },
      theme: 'snow',
    });


    if (content) {
      quill.root.innerHTML = content; // Load existing content into the editor
    } else if (chapterNumber === 1) {
      quill.setContents([{ insert: 'Type here...\n' }]); // Default content for the first editor
    }


    quillEditors[chapterNumber] = quill; // Store the Quill instance for this chapter
  }


  const courseId = $('body').attr('id');


  if (courseId) {
    // Fetch existing chapters for the course
    $.ajax({
      url: `/course/${courseId}/chapters`,
      method: 'GET',
      success: function(chapters) {
        $('.preloader').fadeOut();
        // Remove any existing chapters (if necessary)
        $('.course-sections .chapter').remove();
        $('#page-container .page').remove();
        console.log(chapters);


        // Reset count to the number of chapters loaded
        count = chapters.length;


        chapters.forEach((chapter, index) => {
          const chapterNumber = index + 1;


          // Create chapter button and page
          const newButton = $(`<div class="chapter" data-chapter="${chapterNumber}">
            <div class=""></div>
            <p>Chapter ${chapterNumber}</p>
            <img src="../public/images/whitecancel.svg">
          </div>`);
          $('.course-sections').append(newButton);


          const newPage = $(`<div class="page chapter" data-chapter="${chapterNumber}">
            <div id="editor-${chapterNumber}" class="quill-editor"></div>
          </div>`);
          $('#page-container').append(newPage);


          // Initialize Quill editor with existing content
          initializeQuillEditor(chapterNumber, chapter.content);
        });


        // Adjust the UI to highlight the first chapter as active
        $('.course-sections .chapter div').removeClass('current');
        $('#page-container .page').removeClass('active');


        $('.course-sections .chapter[data-chapter="1"] div').addClass('current');
        $('.page[data-chapter="1"]').addClass('active');
      },
      error: function() {
        console.error('Failed to load chapters.');
      }
    });
  } else {
    // Fresh publish: Initialize the first Quill editor for the first chapter
    $('.page[data-chapter="1"]').addClass('active');
    $('.course-sections .chapter[data-chapter="1"] div').addClass('current');
    initializeQuillEditor(count);
  }




  // Handle adding new chapters
  $('.select-chapter').on('click', () => {
    count++;


    // Remove 'current' class from previous chapter button and hide the active page
    $('.course-sections .chapter div').removeClass('current');
    $('#page-container .page').removeClass('active');


    // Create a new chapter button
    const newButton = $(`<div class="chapter" data-chapter="${count}">
      <div class="current"></div>
      <p>Chapter ${count}</p>
      <img src="../public/images/whitecancel.svg">
    </div>`);
    $('.course-sections').append(newButton);


    // Create a new page with a unique ID for the editor
    const newPage = $(`<div class="page chapter active" data-chapter="${count}">
      <div id="editor-${count}" class="quill-editor"></div>
    </div>`);
    $('#page-container').append(newPage);


    // Initialize a new Quill editor for the new page
    initializeQuillEditor(count);
  });


  // Handle chapter deletion
  $('.course-sections').on('click', '.chapter img', function() {
    const $chapter = $(this).parent();
    const number = $(this).parent().attr('data-chapter');
    $(`#page-container .page[data-chapter="${number}"]`).remove();


    // switch current chapter to a chapter above it.
    if ($(this).prev().prev().hasClass('current')) {
      $('.course-sections .chapter div').removeClass('current');
      $('#page-container .page').removeClass('active');


      const $higherChapter = $(this).parent().prev();
      $higherChapter.children('div').addClass('current');


      $(`#page-container .page[data-chapter="${number - 1}"]`).addClass('active');
    }

    // ensure correct numbering on the remaining instances.
    $chapter.nextAll('.chapter').each(function() {
      // Get current data-chapter value
      var currentNumber = $(this).attr('data-chapter');
     
      $(this).data('chapter', currentNumber - 1);
      // Update the attribute to reflect the new value
      $(this).attr('data-chapter', currentNumber - 1);
      $(this).children('p').text(`Chapter ${currentNumber - 1}`);
      $(`#page-container .page[data-chapter="${currentNumber}"]`).attr('data-chapter', currentNumber - 1);
      $(`#page-container .page[data-chapter="${currentNumber -1}"] .quill-editor`).attr('id', `editor-${currentNumber - 1}`);
    });

    $chapter.remove();
    count--;
    delete window.quillEditors[number];

    // Create a new object to store the reassigned instances
    const newQuillEditors = {};
    // Loop through the remaining editors and reassign their keys (numbers)
    Object.keys(window.quillEditors).forEach((key) => {
      const editor = window.quillEditors[key];
      const newKey = Number(key) > number ? Number(key) - 1 : Number(key);
      newQuillEditors[newKey] = editor;
    });


    // Replace the old object with the new one
    window.quillEditors = newQuillEditors;
  });




  // Use event delegation to handle chapter clicks: set which chapter is visible
  $('.course-sections').on('click', '.chapter p', function() {
    const number = $(this).parent().attr('data-chapter');


    // Remove 'current' class from all chapters and 'active' from all pages
    $('.course-sections .chapter div').removeClass('current');
    $('#page-container .page').removeClass('active');


    // Add 'current' class to the clicked chapter and 'active' to the corresponding page
    $(this).parent().children('div').addClass('current');
    $(`#page-container .page[data-chapter="${number}"]`).addClass('active');
  });
});
