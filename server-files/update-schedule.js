import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fetchAPI } from './utils.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const paths = {
  scheduleon: 'http://0.0.0.0:1337/api/kiosks?fields[0]=url&populate[schedule][fields][1]=*',
  schedules: 'http://0.0.0.0:1337/api/on-schedules?fields[0]=slug&populate[schedule][fields][0]=*&populate[kiosk][fields][0]=url',
  scheduleoff: 'http://0.0.0.0:1337/api/off-schedules?fields[0]=slug&populate[schedule][fields][0]=*&populate[kiosk][fields][0]=url',
};

const updateScheduleJSON = async type => {
  const path = paths[type];
  const data = await fetchAPI(path);

  fs.writeFileSync(`${__dirname}/../static-files/${type}.json`, JSON.stringify(data), 'UTF-8');
}

export { updateScheduleJSON }
