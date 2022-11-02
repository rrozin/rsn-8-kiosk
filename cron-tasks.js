import cron from 'cron';

const tasks = new Map();
const addSchedule = data => {
  console.log('adding schedule', data.schedule)
  tasks.set(data.id, {schedule: new cron.CronJob(data.schedule, () => console.log('new schedule'))});
  tasks.get(data.id).schedule.start();
  console.log('task', tasks);
};
const updateSchedule = data => {
  console.log('updating schedule', data.schedule);
  tasks.get(data.id).schedule.setTime(new cron.CronTime(data.schedule));
  console.log('task', tasks);
};
const removeSchedule = data => {
  console.log('stopping schedule');
  tasks.get(data.id).schedule.stop();
  tasks.delete(data.id);

  console.log('tasks', tasks);
};

export { addSchedule, updateSchedule, removeSchedule };