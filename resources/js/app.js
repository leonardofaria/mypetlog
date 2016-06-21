var isMobile = {
  Android: function() { return navigator.userAgent.match(/Android/i); },
  BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
  iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
  Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
  Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
  any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

var parallaxItems = [];
var fadeItems = [];
var videoItems = [];
var videoIsPlaying = false;

function scrollHandler(e) {
  var windowHeight = window.innerHeight;

  if (!isMobile.any()) {
    parallaxItems.forEach(function(item) {
      var ratio = parseFloat(item.getAttribute('data-parallax'));
      var rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var normalized = (rect.top - windowHeight) / (rect.top - rect.bottom - windowHeight);
        normalized = Math.max(0, Math.min(1, normalized));

        var y = normalized * ratio * rect.height;
        item.style.transform = 'translate(0, ' + y + 'px)';
        item.style.webkitTransform = 'translate(0, ' + y + 'px)';
      }
    });
  }

  fadeItems.forEach(function(item) {
    var rect = item.getBoundingClientRect();
    var offset = parseFloat(item.getAttribute('data-fade') || 0);
    if (rect.top < (window.innerHeight - offset) && rect.bottom > offset) {
      item.style.opacity = 1;
    }
  });

  videoItems.forEach(function(item) {
    var rect = item.getBoundingClientRect();
    var offset = parseFloat(item.getAttribute('data-fade') || 0);
    if (rect.top < (window.innerHeight - offset) && rect.bottom > offset) {
      item.style.opacity = 1;
      if (!videoIsPlaying) {
        item.play();
        videoIsPlaying = true;
      }
    }
  });
}

function init() {
  new WOW().init();

  var itemsParallax = document.querySelectorAll('[data-parallax]');
  var itemsFade = document.querySelectorAll('[data-fade]');
  var itemsVideo = document.querySelectorAll('video');

  for(var i = 0; i < itemsParallax.length; i++) {
    parallaxItems.push(itemsParallax[i]);
  }

  for(i = 0; i < itemsFade.length; i++) {
    fadeItems.push(itemsFade[i]);
  }

  for(i = 0; i < itemsVideo.length; i++) {
    videoItems.push(itemsVideo[i]);
  }

  scrollHandler();
  window.addEventListener('scroll', scrollHandler);

  if (!isMobile.any()) {
    var screenshot = document.querySelector('.screenshot');
    var form = document.querySelector('.form');
    form.style.height = screenshot.height + 'px';
  }

  document.querySelector('.contact-form').addEventListener('submit', function(e){
    e.preventDefault();

    var form = e.target;
    var data = new FormData(form);
    var request = new XMLHttpRequest();
    var response = document.querySelector(".response");

    response.innerText = 'Sending...';

    request.onreadystatechange = function() {
      response.innerText = 'Thanks for your message';
    };

    request.open(form.method, form.action);
    request.setRequestHeader('Accept', 'application/json');
    request.send(data);
  });
}

window.onload = init;
