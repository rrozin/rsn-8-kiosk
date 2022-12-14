import './resources/styles/style.scss';
import Swiper, { Autoplay, Manipulation, EffectFade, EffectFlip, EffectCube, EffectCoverflow }  from 'swiper';
import 'swiper/css/bundle';

const socket = new WebSocket(`ws://${location.hostname.split('.')[0]}:3000/`);

const changeURL = url => {
  const path =`http://${location.host}/public/${url}`;
  location.href = path;
};

socket.addEventListener('message', (event) => {
  console.log('Message from server', event.data);
  changeURL(event.data);

  socket.send(Date.now())
});

const swiperWrapper = document.getElementById('swiper_wrapper');
const params = !swiperWrapper.dataset.swiper && {} || JSON.parse(swiperWrapper.dataset.swiper);

const initSlides = () => {
  let carousel;
  let currentItem;
  let type;
  let video;

  carousel = new Swiper('.swiper', {
    modules: [Autoplay, EffectFade, EffectFlip, EffectCube, EffectCoverflow],
    autoplay: {
      delay: params.delay || 3000,
      disableOnInteraction: false
    },
    effect: params.effect || '',
    fadeEffect: {
      crossFade: true
    },
    speed: params.speed || 1000,
    loop: true,
  });

  const playVideo = () => {
      video.currentTime = 0;
      carousel.autoplay.stop();

      currentItem.querySelector('video').play();

      video.onended = () => {
        carousel.slideNext();
      };
  }

  carousel.on('imagesReady', item => {
    currentItem = carousel.slides[carousel.activeIndex];
    type = currentItem.dataset.type;
    video = currentItem.querySelector('video');

    if(type === 'video'){
      playVideo();
    }
  });

  carousel.on('realIndexChange', item => {
    if(!carousel.slides.length) {
      return;
    }

    currentItem = item.slides[item.activeIndex];
    type = currentItem.dataset.type;
    video = currentItem.querySelector('video');

    if(!carousel.autoplay.running) {
      carousel.autoplay.start();
    }

    if(type === 'video'){
      playVideo();
    }
  });
};

const init = () => {
  initSlides();
};

addEventListener('DOMContentLoaded', init());
