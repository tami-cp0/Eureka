$(() => {
  let page = 2;

  $('.showmore').on('click', () => {    
    $.ajax({
      url: `https://eureka-1han.onrender.com/getMoreCourses?page=${page}`,
      type: 'GET',
      xhrFields: {
        withCredentials: true
      },
      success: function(response) {
        page++;
        
        response.forEach(course => {
          const courseHTML = `
              <a href="https://eureka-1han.onrender.com/course/${course._id}/view">
                <div class="card" id="${course._id}">
                            ${course.thumbnail && course.thumbnail.data ? 
                                `<img src="data:${course.thumbnail.mimeType};base64,${course.thumbnail.data}" alt="Course Thumbnail">` :
                                `<img src="../../public/images/default-placeholder.png" alt="Default Course Thumbnail">`}
                            <p class="niche">${course.niche}</p>                    
                            <div class="heading">
                                <h5 class="title">${course.title}</h5>
                                <img src="../public/images/dot.svg">
                                <p class="courseDuration">${course.duration}</p>
                            </div>
                            <h6 class="author">${course.author}</h6>  
                        </div>
                    </a>`;
          
          $('.cards').append(courseHTML);
      });
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error:', textStatus, errorThrown);
      }
    });
  });
})