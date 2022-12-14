import cron from 'cron';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cronSchedule, eventEmitter } from './utils.js';
import { updateCurrentPage, getCurrentPage } from './current-page.js';
import shell from 'shelljs';

const tasks = new Map();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const actions = {
  'schedule': data => {
    console.log('schedule page ------------', data)

    shell.exec('sh ~/kiosk/shell-scripts/tv-on.sh');
    updateCurrentPage(data.url);
    eventEmitter.emit('route', data.url);
  },
  'off-schedule': data => {
    console.log('Turn TV Off!', data);
    shell.exec('sh ~/kiosk/shell-scripts/tv-off.sh');
  }
};

const addSchedule = data => {
  console.log('start schedule ---------- ', data.action, data.schedule);
  tasks.set(data.url, { schedule: new cron.CronJob(data.schedule, () => actions[data.action](data)) });
  tasks.get(data.url).schedule.start();
};

const removeSchedule = data => {
  tasks.get(data.url).schedule.stop();
  tasks.delete(data.url);
};

const updateSchedule = data => {
  if(!tasks.has(data.url)) return;

  removeSchedule(data);
  addSchedule(data);

  console.log('updating schedule', data.url, data.schedule);
};

const setSchedule = data => {
  const task = tasks.get(data.url);

  if(!task) {
    addSchedule(data);
    return;
  }

  updateSchedule(data);
};

const startup = () => {
  const onScheduleData = fs.readFileSync(`${__dirname}/../static-files/scheduleon.json`, 'utf8');
  const offScheduleData = fs.readFileSync(`${__dirname}/../static-files/scheduleoff.json`, 'utf8');
  const onSchedules = onScheduleData && JSON.parse(onScheduleData) || '';
  const offSchedules = offScheduleData && JSON.parse(offScheduleData) || '';
  const lastPage = getCurrentPage();

  if(onSchedules && onSchedules.data && onSchedules.data.length) {
    onSchedules.data.forEach(item => {
      const scheduleObj = {};
      const scheduleRoot = item.attributes;
      const scheduleData = scheduleRoot.schedule;
      const url = scheduleRoot.url;

      scheduleObj.schedule = cronSchedule(scheduleData.minute, scheduleData.hour, scheduleData.day);
      scheduleObj.url = url;
      scheduleObj.action = 'schedule';

      setSchedule(scheduleObj);
    });
  }

  if(offSchedules && offSchedules.data && offSchedules.data.length) {
    offSchedules.data.forEach(item => {
      const scheduleObj = {};
      const scheduleRoot = item.attributes;
      const scheduleURL = scheduleRoot.slug;
      const scheduleData = scheduleRoot.schedule;

      scheduleObj.schedule = cronSchedule(scheduleData.minute, scheduleData.hour, scheduleData.day);
      scheduleObj.url = scheduleURL;
      scheduleObj.action = 'off-schedule';

      setSchedule(scheduleObj)
    });
  }

  if(lastPage) {
    console.log('load last page')
    eventEmitter.emit('route', lastPage);
    return;
  }

  eventEmitter.emit('route', './');

  console.log('load root page');
};

export { setSchedule, removeSchedule, startup };
