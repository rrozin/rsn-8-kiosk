import EventEmitter from 'events';
import fetch from 'node-fetch';

const cronSchedule = (minute, hour, day) => {
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const cron = `0 ${minute} ${hour} * * ${dayMap.indexOf(day)}`;

  return cron;
};

const fetchAPI = async (path) => {
  const res = await fetch(path);
  const json = await res.json();

  return json;
};

const eventEmitter = new EventEmitter();

export { cronSchedule, eventEmitter, fetchAPI };