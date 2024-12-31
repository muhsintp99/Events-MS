$(document).ready(function() {
    // Initialize the Owl Carousel
    var owl = $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 10,
      nav: false,
      autoplay: true,
      autoplayTimeout: 2500,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 2,
          margin: 40
        },
        480: {
          items: 3,
          margin: 60
        },
        640: {
          items: 4,
          margin: 80
        },
        992: {
          items: 6,
          margin: 120
        }
      },
      mouseDrag: true, // Allow mouse drag
      touchDrag: true, // Allow touch drag
      onInitialized: function(event) {
        this.addClass('owl-loaded');
      }
    });
  
    // Mouse wheel control for the carousel
    $(".owl-carousel").on('wheel', function(e) {
      if (e.originalEvent.deltaY > 0) {
        owl.trigger('next.owl.carousel');
      } else {
        owl.trigger('prev.owl.carousel');
      }
      e.preventDefault(); // Prevent default scrolling behavior
    });
  });
  