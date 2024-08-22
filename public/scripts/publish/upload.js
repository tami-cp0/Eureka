$(() => {
  // save and upload all information to storage
  //
  //

  // this is to convert the course image to binary
  function imageToBinary(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        // Convert ArrayBuffer to Uint8Array
        const arrayBuffer = event.target.result;
        const imageBuffer = new Uint8Array(arrayBuffer);
        resolve(imageBuffer);
      };
      
      reader.onerror = function(event) {
        reject(new Error("File could not be read: " + event.target.error));
      };
      
      // Read the file as an ArrayBuffer
      reader.readAsArrayBuffer(imageFile);
    });
  }


  async function collectInfo() {
    // {course: {schema json form}, sections: [quiz or chapter, in their schema json form]}

    const title = $('#title').val().trim();
    const duration = $('#duration').val().trim();
    const niche = $('#niche').val().trim();
    const overview = $('#overview').val().trim();

    // courseSchema already has default values
    let course = { title, duration, niche, overview };

    let complete = true;
    for (const value of Object.values(course)) {
      if (!value) {
        complete = false;
        break;
      }
    }

    // for image
    const fileInput = $('#image')[0];
    const imageFile = fileInput.files[0];
    let thumbnail;
    if (imageFile) {
      thumbnail = await imageToBinary(imageFile);
    }
    if (thumbnail) {
      course = { title, duration, niche, overview, thumbnail };
    }

    const sections = [];
    let totalChapters = 0;
    for (const number of Object.keys(quillEditors)) {
      if (quillEditors[number].getText().trim() === '') {
        throw new Error(`Chapter ${number} is empty`);
      }

      totalChapters++;
      sections.push({content: quillEditors[number].root.innerHTML, type: 'Chapter'});
    }

    course['totalChapters'] = totalChapters;

    
    return { course, sections, complete };
  }

  const courseId = $('body').attr('id');
  let requestMethod;
  let requestURL;

  // if course already exists it should just update it
  if (courseId) {
    requestMethod = 'PUT';
    requestURL = `http://localhost:6789/publish/${courseId}`; 
  } else {
    requestMethod = 'POST';
    requestURL = 'http://localhost:6789/publish';
  }

  $('.draftUpload').on('click', async () => {
    $('.status.loading').css({
      top: '20px',
      display: 'flex',
    });
    $('.status.loading p').text('Saving to drafts');
    
    try {
      const collectedData = await collectInfo();

      $.ajax({
        url: `${requestURL}?draft=true`,
        method: requestMethod,
        contentType: 'application/json',
        data: JSON.stringify(collectedData),
        xhrFields: {
          withCredentials: true
        },
        success: function(response) {
          $('.status.loading').css({
            top: '-70px',
            display: 'none'
          });
          $('.status.success').css({
            top: '20px',
            display: 'flex'
          });
          $('.status.success p').text('Saved to draft');
          setTimeout(() => {
            $('.status.success').fadeOut();
            $('.status.success').css({
              top: '-70px',
              display: 'none'
            });
          }, 3000);

          $('body').attr('id', response.courseId);
        },
        error: function(xhr, status, error) {
          $('.status.loading').css({
            top: '-70px',
            display: 'none'
          });
          $('.status.failed').css({
            top: '20px',
            display: 'flex'
          });
          $('.status.failed p').text('Unable to save, try again');

          setTimeout(() => {
            $('.status.failed').fadeOut();
            $('.status.failed').css({
              top: '-70px',
              display: 'none'
            });
          }, 3000);
          console.log('Error:', error);
        }
      });
    } catch (error) {
      console.error('Collect info error:', error);
    }
  });

  $('.publishUpload').on('click', async () => {
    $('.status.loading').css({
      top: '20px',
      display: 'flex',
    });
    $('.status.loading p').text('Publishing course');
    
    try {
      const collectedData = await collectInfo();
      if (!collectedData.complete) {
        $('.status.loading').css({
          top: '-70px',
          display: 'none'
        });
        $('.status.failed').css({
          top: '20px',
          display: 'flex'
        });
        $('.status.failed p').text('All course information is required before publishing');

        $('.info').css('box-shadow', 'inset 0 0 0 2px red');
        $('.info:last-child').css('box-shadow', 'none');

        setTimeout(() => {
          $('.status.failed').fadeOut();
          $('.status.failed').css({
            top: '-70px',
            display: 'none'
          });

          $('.info').css('box-shadow', 'none');
        }, 8000);

        return;
      }

      $.ajax({
        url: `${requestURL}draft=false`,
        method: requestMethod,
        contentType: 'application/json',
        data: JSON.stringify(collectedData),
        xhrFields: {
          withCredentials: true
        },
        success: function(response) {
          $('.status.loading').css({
            top: '-70px',
            display: 'none'
          });
          $('.status.success').css({
            top: '20px',
            display: 'flex'
          });
          $('.status.success p').text('Published course');
          setTimeout(() => {
            $('.status.success').fadeOut();
            $('.status.success').css({
              top: '-70px',
              display: 'none'
            });
          }, 3000);

          $('body').attr('id', response.courseId);
        },
        error: function(xhr, status, error) {
          $('.status.loading').css({
            top: '-70px',
            display: 'none'
          });
          $('.status.failed').css({
            top: '20px',
            display: 'flex'
          });
          $('.status.failed p').text('Publishing failed, try again.');

          setTimeout(() => {
            $('.status.failed').fadeOut();
            $('.status.failed').css({
              top: '-70px',
              display: 'none'
            });
          }, 3000);
          console.log('Error:', error);
        }
      });
    } catch (error) {
      console.error('Collect info error:', error);
    }
  });
});