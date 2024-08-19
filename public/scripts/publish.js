// quill editor 
$(() => {
  // Initial content to be loaded into the first Quill editor
  const initialData = {
    about: [
      { insert: 'Type here...\n' },
    ],
  };

  // Initialize the first Quill editor for the first chapter
  let chapterCount = 1;
  const quillEditors = {}; // Object to store all Quill editor instances

  // Function to initialize a Quill editor for a given chapter
  function initializeQuillEditor(chapterNumber) {
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

    if (chapterNumber === 1) {
      quill.setContents(initialData.about); // Load initial content into the first editor
    }

    quillEditors[chapterNumber] = quill; // Store the Quill instance for this chapter
  }

  // Show the first page and initialize the first Quill editor
  $('.page[data-chapter="1"]').addClass('active');
  $('.course-sections .chapter[data-chapter="1"] div').addClass('current');
  initializeQuillEditor(chapterCount);

  // Handle adding new chapters
  $('.select-chapter').on('click', () => {
    chapterCount++;

    // Remove 'current' class from previous chapter button and hide the active page
    $('.course-sections .chapter div').removeClass('current');
    $('#page-container .page').removeClass('active');

    // Create a new chapter button
    const newButton = $(`<div class="chapter" data-chapter="${chapterCount}">
      <div class="current"></div>
      <p>Chapter ${chapterCount}</p>
    </div>`);
    $('.course-sections').append(newButton);

    // Create a new page with a unique ID for the editor
    const newPage = $(`<div class="page chapter active" data-chapter="${chapterCount}">
      <div id="editor-${chapterCount}" class="quill-editor"></div>
    </div>`);
    $('#page-container').append(newPage);

    // Initialize a new Quill editor for the new page
    initializeQuillEditor(chapterCount);
  });


  // Use event delegation to handle chapter clicks
  $('.course-sections').on('click', '.chapter', function() {
    const number = $(this).attr('data-chapter');

    // Remove 'current' class from all chapters and 'active' from all pages
    $('.course-sections .chapter div').removeClass('current');
    $('#page-container .page').removeClass('active');

    // Add 'current' class to the clicked chapter and 'active' to the corresponding page
    $(this).children('div').addClass('current');
    $(`#page-container .page[data-chapter="${number}"]`).addClass('active');
  });

  // handle adding quiz
  let quizCount = 0;

  $('.select-quiz').on('click', function() {
    quizCount++;
      // Remove 'current' class from previous chapter button and hide the active page
      $('.course-sections .chapter div').removeClass('current');
      $('#page-container .page').removeClass('active');

      const quizSelector = $(`<div class="chapter" data-quiz="${quizCount}">
                    <div class="current"></div>
                    <p>Quiz ${quizCount}</p>
                </div>`);

      const quizPage = $(`<div class="page quiz active" data-quiz="${quizCount}">
                    <div></div>
                </div>`);

      $('.course-sections').append(quizSelector);
      $('#page-container').append(quizPage);
  });
});

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
  $('.info-section article div').on('click', function() {
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
  document.getElementById('image').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : 'No file chosen';
    document.getElementById('file-name').textContent = fileName;
    document.getElementById('button-text').textContent = 'Change course image';
  }); 




  // quiz section
  let questionCount = 1;

  $('.add-question').on('click', () => {
    questionCount++;

    const newQuestion = $(`
      <div class="question">
        <label for="question-${questionCount}">Question ${questionCount}:</label>
        <textarea id="question-${questionCount}" name="question-${questionCount}"></textarea>
        
        <div class="options">
          <label>
            <input type="radio" name="answer-${questionCount}" value="A">
            A. <input type="text" name="option-${questionCount}-a">
          </label>
          <label>
            <input type="radio" name="answer-${questionCount}" value="B">
            B. <input type="text" name="option-${questionCount}-b">
          </label>
          <label>
            <input type="radio" name="answer-${questionCount}" value="C">
            C. <input type="text" name="option-${questionCount}-c">
          </label>
          <label>
            <input type="radio" name="answer-${questionCount}" value="D">
            D. <input type="text" name="option-${questionCount}-d">
          </label>
          
        </div>
      </div>
    `);

    $('.questions').append(newQuestion);
  });

  // resize the question space dynamically
  $('#question-1').on('input', function() {
    this.style.height = (this.scrollHeight) + 'px'; // Set it to the scrollHeight
  });
});
