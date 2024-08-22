window.count = 1; // track chapter and quiz order

// quill editor 
$(() => {
  // Initial content to be loaded into the first Quill editor
  const initialData = {
    about: [
      { insert: 'Type here...\n' },
    ],
  };

  // Initialize the first Quill editor for the first chapter
  window.quillEditors = {}; // Object to store all Quill editor instances

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
  initializeQuillEditor(count);

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
});
