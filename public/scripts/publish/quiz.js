// count is defined in chapter.js: used to track order of quiz and chapters
// $(() => {
//   let quizCount = 0;

//   $('.select-quiz').on('click', function() {
//     quizCount++;
//       // Remove 'current' class from previous chapter button and hide the active page
//       $('.course-sections .chapter div').removeClass('current');
//       $('#page-container .page').removeClass('active');

//       const quizSelector = $(`<div class="chapter" data-quiz="${quizCount}">
//                     <div class="current"></div>
//                     <p>Quiz ${quizCount}</p>
//                 </div>`);

//       const quizPage = $(`<div class="page quiz active" data-quiz="${quizCount}">
//                     <div></div>
//                 </div>`);

//       $('.course-sections').append(quizSelector);
//       $('#page-container').append(quizPage);
//   });


//   // quiz section
//   let questionCount = 1;

//   $('.add-question').on('click', () => {
//     questionCount++;

//     const newQuestion = $(`
//       <div class="question">
//         <label for="question-${questionCount}">Question ${questionCount}:</label>
//         <textarea id="question-${questionCount}" name="question-${questionCount}"></textarea>
        
//         <div class="options">
//           <label>
//             <input type="radio" name="answer-${questionCount}" value="A">
//             A. <input type="text" name="option-${questionCount}-a">
//           </label>
//           <label>
//             <input type="radio" name="answer-${questionCount}" value="B">
//             B. <input type="text" name="option-${questionCount}-b">
//           </label>
//           <label>
//             <input type="radio" name="answer-${questionCount}" value="C">
//             C. <input type="text" name="option-${questionCount}-c">
//           </label>
//           <label>
//             <input type="radio" name="answer-${questionCount}" value="D">
//             D. <input type="text" name="option-${questionCount}-d">
//           </label>
          
//         </div>
//       </div>
//     `);

//     $('.questions').append(newQuestion);
//   });

//   // resize the question space dynamically
//   $('#question-1').on('input', function() {
//     this.style.height = (this.scrollHeight) + 'px'; // Set it to the scrollHeight
//   });
// });


$(() => {
  $('.select-quiz').on('click', () => {
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