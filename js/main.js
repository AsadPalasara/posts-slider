window.addEventListener('load', (event) => {
  var PostsContainer = document.getElementById("postslider");
  var restapi_btn = document.getElementById("restapi_btn");

  if (PostsContainer) {

    // Change API on Click
    restapi_btn.addEventListener("click", function () {
      var api_value = document.getElementById("restapi").value;

      // Click button with empty input
      if (api_value === '') {
        getpost('https://wptavern.com/')
      } else {
        getpost(api_value);
      }
    })

    // Get API
    function getpost(wppost) {
      var ourRequest = new XMLHttpRequest();
      var api_value = wppost;

      ourRequest.open('GET', api_value + 'wp-json/wp/v2/posts');
      ourRequest.onload = function () {
        if (ourRequest.status >= 200 && ourRequest.status < 400) {
          var data = JSON.parse(ourRequest.responseText);
          createHTML(data);
          function slider_height() {
            const carousel = document.querySelector(".carousel");
            const slides_height = document.getElementById("postslider").offsetHeight;
            carousel.style.height = slides_height + "px";
          }

          slider_height();

        } else {
          console.log("We connected to the server, but it returned an error.");
        }
      };

      ourRequest.onerror = function () {
        console.log("Connection error");
      };

      ourRequest.send();

    }

    getpost('https://wptavern.com/'); // Load default API

    // Slider items HTML
    function createHTML(postsData) {
      var postlistHTML = '';
      var api_value = document.getElementById("restapi").value;
      for (i = 0; i < postsData.length; i++) {

        postlistHTML += '<div class="slider--item"' + '>'
        if (postsData[i].episode_featured_image) {
          postlistHTML += '<a target="_blank" href=' + postsData[i].link + '><img src=' + postsData[i].episode_featured_image + '></a>';
        }
        postlistHTML += '<div class="slider--content">'
        postlistHTML += '<h4 class="slider--title"> <a target="_blank" href=' + postsData[i].link + '>' + postsData[i].title.rendered + '</a></h4 >';
        postlistHTML += '<div class="slider--date">' + new Date(postsData[i].date.substring(0, 10)).toDateString() + '</div>';
        postlistHTML += '<div class="slider--excerpt">' + postsData[i].excerpt.rendered + '</div>';
        postlistHTML += '</div>';
        postlistHTML += '</div>';


      }
      PostsContainer.innerHTML = postlistHTML;
    }

  }


  // Slider Code

  function post_slider() {
    const delay = 5000; //ms Auto slide

    const slides = document.querySelector(".slider");
    const slidesCount = slides.children.length;
    const maxLeft = (slidesCount - 1) * 100 * -1;

    let current = 0;

    function changeSlide(next = true) {

      if (next) {
        current += current > maxLeft ? -100 : current * -1;
      } else {
        current = current < 0 ? current + 100 : maxLeft;
      }
      slides.style.left = current + "%";
      slider_height()

    }

    let autoChange = setInterval(changeSlide, delay);
    const restart = function () {
      clearInterval(autoChange);
      autoChange = setInterval(changeSlide, delay);
    };

    // Controls
    document.querySelector(".next-slide").addEventListener("click", function () {
      changeSlide();
      restart();
    });

    document.querySelector(".prev-slide").addEventListener("click", function () {
      changeSlide(false);
      restart();
    });

    // Slide with LEFT/RIGHT Key
    document.onkeydown = function (event) {
      var e = event || window.event;
      // Exclued event while typing in input
      if (document.activeElement.getAttribute('id') === 'restapi') {
        return
      }
      if (e.keyCode == '37') { //LEFT
        changeSlide(false);
        restart();
      } else if (e.keyCode == '39') { //RIGHT
        changeSlide();
        restart();
      }
    }

    // Slide with swipe
    function swiper() {
      let pageWidth = window.innerWidth || document.body.clientWidth;
      let treshold = Math.max(1, Math.floor(0.01 * (pageWidth)));
      let touchstartX = 0;
      let touchstartY = 0;
      let touchendX = 0;
      let touchendY = 0;

      const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
      const gestureZone = document.getElementById('postslider');

      gestureZone.addEventListener('touchstart', function (event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
      }, false);

      gestureZone.addEventListener('touchend', function (event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture(event);
      }, false);

      function handleGesture(e) {
        let x = touchendX - touchstartX;
        let y = touchendY - touchstartY;
        let xy = Math.abs(x / y);
        let yx = Math.abs(y / x);
        if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
          if (yx <= limit) {
            if (x < 0) {
              changeSlide();
              restart();
            } else {
              changeSlide(false);
              restart();
            }
          }
        }
      }
    }
    swiper();

    // Get Slide Height
    function slider_height() {
      const carousel = document.querySelector(".carousel");
      const slides_height = document.getElementById("postslider").offsetHeight;
      carousel.style.height = slides_height + "px";
    }

    slider_height();

    // Update Slider height for screen resize
    window.addEventListener('resize', function (event) {
      slider_height();
    }, true);


  };

  function postslider_time_out_Function() {
    setTimeout(post_slider, 5000);
  }

  postslider_time_out_Function();


});