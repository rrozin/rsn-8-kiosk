import fs from 'fs';
import jsdom from 'jsdom';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fetchAPI } from '../server-files/utils.js';
import os from 'os';
import { getCurrentPage } from '../server-files/current-page.js';
import { eventEmitter } from '../server-files/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const template = `${__dirname}/template.html`;
const mediaRoot = '../../rsn8-cms/public/' || '/public';

const outputPath = (path = '') => {
  const location = os.hostname();
  const returnPath = (location === 'resonate') ? `/home/rsn8/kiosk/public/${path}` : `./public/${path}`;
  // const returnPath = `./public/${path}`;
  return returnPath;
};

const createFolder = folderName => {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
      console.log('new folder', folderName);
    }
  } catch (err) {
    console.error(err);
  }
};

const imgTemplate = imgSrc => `
  <div class="swiper-slide" data-type="img">
    <img class="media" src="${mediaRoot}${imgSrc}" />
  </div>
`;

const videoTemplate = videoSrc => `
  <div class="swiper-slide" data-type="video">
    <video class ="media" muted autoplay>
      <source type="video/mp4" src="${mediaRoot}${videoSrc}">
    </video>
  </div>
`;

const deletePage = folderName => {
  //console.log('removing page', outputPath(folderName));
  fs.rmSync(outputPath(folderName), { recursive: true, force: true });
};

const buildSlides = media => {
  const setTemplate = {
    '.jpg': img => imgTemplate(img),
    '.png': img => imgTemplate(img),
    '.mp4': vid => videoTemplate(vid)
  };


  let markup = '';

  media.forEach(item => {
    markup += setTemplate[item.attributes.ext](item.attributes.url)
  });

  return markup;
};

function clearAllPages(path) {
//  console.log('path', path);
  return fs.readdirSync(path).filter(function (file) {
    const isDirectory = fs.statSync(path+'/'+file).isDirectory();

    if(isDirectory) {
      //console.log('file', file);
      deletePage(file);
    }
  });
}

const modifyPage = async () => {
  const pageTemplate = fs.readFileSync(template, 'utf8');
  const path = `http://${os.hostname()}:1337/api/kiosks?fields[0]=url&fields[1]=delay&fields[2]=speed&fields[3]=effect&populate[media][fields][0]=url&populate[media][fields][1]=ext&populate[on-schedules][fields][0]=slug`;
  const content = await fetchAPI(path);

  if(!content) return;

  // clear out existing folder
  clearAllPages(outputPath());

  //iterate through data
  content.data.forEach(item => {
    const dom = new jsdom.JSDOM(pageTemplate);
    const app = dom.window.document.querySelector('#swiper_wrapper');
    const attr = item.attributes;
    const params = {};

    if(attr.delay) {
      params.delay = attr.delay * 1000;
    }

    if(attr.speed) {
      params.speed = attr.speed;
    }

    params.effect = !attr.effect ? '' : attr.effect;

    app.dataset.swiper = JSON.stringify(params);
    app.innerHTML += buildSlides(attr.media.data);

    // //build new folder(s) and create new files
    createFolder(outputPath(attr.url));
    fs.writeFileSync(`${outputPath(attr.url)}/index.html`, dom.serialize(), 'UTF-8');

    if(attr.url === getCurrentPage()) {
      console.log('refresh page!!!!!!')
      eventEmitter.emit('route', getCurrentPage());
    }
    
  });
};

const createPage = (path, media) => {
  createFolder(outputPath(path));
  modifyPage(path, media);
};


export { createPage, modifyPage, deletePage };
