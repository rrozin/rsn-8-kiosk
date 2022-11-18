import cron from 'cron';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cronSchedule, eventEmitter } from './utils.js';
import { updateCurrentPage, getCurrentPage } from './current-page.js';

const tasks = new Map();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const actions = {
  'schedule': data => {
    console.log('test')
    updateCurrentPage(data.url);
    eventEmitter.emit('route', data.url);
  },
  'schedule-off': data => {
    console.log('Turn TV Off!', data);
  }
};

const addSchedule = data => {
  // tasks.set(data.title, {schedule: new cron.CronJob(data.schedule, () => {
  //   updateCurrentPage(data.url);
  //   eventEmitter.emit('route', data.url);
  // })});
  console.log('set action', actions[data.action])
  tasks.set(data.title, {schedule: new cron.CronJob(data.schedule, () => actions[data.action](data))});
  tasks.get(data.title).schedule.start();

  console.log('adding new schedule', data.url, data.schedule);
};

const removeSchedule = data => {
  tasks.get(data.title).schedule.stop();
  tasks.delete(data.title);
};

const updateSchedule = data => {
  if(!tasks.has(data.title)) return;

  removeSchedule(data);
  addSchedule(data);

  console.log('updating schedule', data.url, data.schedule);
};

const setSchedule = data => {
  const task = tasks.get(data.title);

  if(!task) {
    addSchedule(data);
    // console.log('SETSCHEDULE: adding new title')
    return;
  }
    
  console.log(data);
  updateSchedule(data);
};

const startup = () => {
  const onScheduleData = fs.readFileSync(`${__dirname}/../static-files/schedules.json`, 'utf8');
  const onSchedules = JSON.parse(onScheduleData);
  const scheduleObj = {};
  const lastPage = getCurrentPage();

  if(onSchedules) {
    onSchedules.data.forEach((item) => {
      const scheduleRoot = item.attributes;
      const scheduleData = scheduleRoot.schedule;
      const kiosk = scheduleRoot.kiosk.data.attributes;
  
      scheduleObj.title = scheduleRoot.slug;
      // format the schedule
      scheduleObj.schedule = cronSchedule(scheduleData.minute, scheduleData.hour, scheduleData.day);
      scheduleObj.url = kiosk.url;
      
      setSchedule(scheduleObj);
    });
  }

  if(lastPage) {
    console.log('load last page')
    eventEmitter.emit('route', lastPage);
    return;
  }

  eventEmitter.emit('route', './');
  
  console.log('load root page')
};

export { setSchedule, removeSchedule, startup };