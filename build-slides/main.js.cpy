import './resources/styles/style.scss';
import Swiper, { Autoplay, Manipulation, EffectFade, EffectFlip, EffectCube, EffectCoverflow }  from 'swiper';
import 'swiper/css/bundle';

const socket = new WebSocket('ws://resonate:3000/');

const changeURL = url => {
  const path =`http://${location.host}/public/${url}`;
  location.href = path;
};

console.log('socket');
socket.addEventListener('message', (event) => {
  console.log('Message from server', event.data);
  changeURL(event.data);

  socket.send(Date.now())
});

const swiperWrapper = document.getElementById('swiper_wrapper');
const params = !swiperWrapper.dataset.swiper && {} || JSON.parse(swiperWrapper.dataset.swiper);

let swiper;
const initSlides = () => {
  swiper = new Swiper('.swiper', {
    modules: [Autoplay, Manipulation, EffectFade, EffectFlip, EffectCube, EffectCoverflow],
    autoplay: {
      delay: params.delay || 3000,
    },
    effect: params.effect || '',
    fadeEffect: {
      crossFade: true
    },
    speed: params.speed || 1000,
    loop: true
  });

  // console.log(swiper);
};

const startSlides = () => {
  let currentItem;
  let type;
  let video;
  swiper.on("activeIndexChange", item => {
    currentItem = item.slides[item.activeIndex];
    if(!swiper.slides.length) {
      return;
    }

    type = currentItem.dataset.type;
    video = currentItem.querySelector('video');

    if(type === 'video'){
      video.currentTime = 0;
      swiper.autoplay.stop();
      // currentItem.querySelector('video').play();
      video.onended = () => {
        // swiper.autoplay.run();
        swiper.autoplay.start();
        // swiper.slideNext();
      };
      return;
    }
  });
};

const init = () => {
  initSlides();
  swiper.autoplay.start();
  startSlides();
};

addEventListener('DOMContentLoaded', init());
