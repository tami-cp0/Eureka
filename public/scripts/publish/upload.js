$(() => {
  // save and upload all information to storage
  //
  //
  function imageToBase64(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        const base64String = event.target.result.split(',')[1]; // Extract the base64 part
        resolve(base64String);
      };
      
      reader.onerror = function(event) {
        reject(new Error("File could not be read: " + event.target.error));
      };
      
      reader.readAsDataURL(imageFile); // This will encode the image as base64
    });
  }  
  
  // Inside your collectInfo function
  async function collectInfo() {
    const title = $('#title').val().trim();
    const duration = $('#duration').val().trim();
    const niche = $('#niche').val().trim();
    const overview = $('#overview').val().trim();
  
    const fileInput = $('#image')[0];
    const imageFile = fileInput.files[0];
    let thumbnail;
    if (imageFile) {
      thumbnail = { data: await imageToBase64(imageFile), type: imageFile.type};
    }
  
    const course = { title, duration, niche, overview, thumbnail };
  
    const sections = [];
    let totalChapters = 0;
    for (const number of Object.keys(quillEditors)) {
      if (quillEditors[number].getText().trim() === '') {
        throw new Error(`Chapter ${number} is empty`);
      }
  
      totalChapters++;
      sections.push({ content: quillEditors[number].root.innerHTML, type: 'Chapter' });
    }
  
    course['totalChapters'] = totalChapters;
    
    return { course, sections, complete: !!(title && duration && niche && overview) };
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
    $('.status').css('display', 'none');
    $('.status.loading').css({
      top: '20px',
      display: 'flex',
    });
    $('.status.loading p').text('Saving to drafts');
    
    try {
      const collectedData = await collectInfo();
      console.log(collectedData);

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
          }, 5000);

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
          }, 5000);
          console.log('Error:', error);
        }
      });
    } catch (error) {
      $('.status.failed').css({
        top: '20px',
        display: 'flex'
      });
      $('.status.failed p').text(error.message);
      setTimeout(() => {
        $('.status.failed').fadeOut();
        $('.status').css({
          top: '-70px',
          display: 'none'
        });
      }, 5000);
      console.error('Collect info error:', error);
    }
  });

  $('.publishUpload').on('click', async () => {
    $('.status').css('display', 'none');
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
        url: `${requestURL}?draft=false`,
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
          }, 5000);

          $('body').attr('id', response.courseId);

          if (response.redirect) {
            window.location.href = response.redirect;
          }
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
          }, 5000);
          console.log('Error:', error);
        }
      });
    } catch (error) {
      $('.status.failed').css({
        top: '20px',
        display: 'flex'
      });
      $('.status.failed p').text(error.message);
      setTimeout(() => {
        $('.status.failed').fadeOut();
        $('.status').css({
          top: '-70px',
          display: 'none'
        });
      }, 5000);
      console.error('Collect info error:', error);
    }
  });
});