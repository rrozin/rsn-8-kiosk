import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import WebSocket, { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setSchedule, removeSchedule, startup } from './server-files/cron-tasks.js';
import { createPage, modifyPage, deletePage } from './build-page/build-page.js';
import { updateScheduleJSON } from './server-files/update-schedule.js';
import { cronSchedule, eventEmitter } from './server-files/utils.js';
import { updateCurrentPage, getCurrentPage } from './server-files/current-page.js';
import shell from 'shelljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer({ server });

let ws = null;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

io.on('connection', function(socket) {
  console.log('A user connected');
  ws = socket;

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

const scheduleOn = (event, entry, model) => {
  const schedule = entry.schedule;
  const path = entry.url;
  const actions = {
    'entry.create': setSchedule,
    'entry.update': setSchedule,
    'entry.delete': removeSchedule
  };

  if(event === 'entry.delete') {
    actions['entry.delete']({url: path});
    return;
  }

  // if(!kiosk) return;
  updateScheduleJSON('scheduleon');

  const cron = cronSchedule(schedule.minute, schedule.hour, schedule.day);

  actions[event]({title: path, schedule: cron, url: path, action: model});
};

const scheduleOff = (event, entry, model) => {
  const name = entry.slug;
  const schedule = entry.schedule;
  const cron = cronSchedule(schedule.minute, schedule.hour, schedule.day);
  const actions = {
    'entry.create': setSchedule,
    'entry.update': setSchedule,
    'entry.delete': removeSchedule
  }

  updateScheduleJSON('scheduleoff');

  // console.log('schedule off')
  actions[event]({title: name, schedule: cron, action: model});
};

const kioskTasks = (event, entry) => {
  const name = entry.url;
  const schedule = entry.schedule;
  const actionTypes = {
    'entry.create': () => modifyPage(),
    'entry.update': () => modifyPage(),
    'entry.delete': () => {
      if(name === getCurrentPage()) {
        updateCurrentPage('');
        ws.send('./');
      }

      deletePage(name)
    },
  };

  actionTypes[event]();

  // set schedule
  if(schedule.min === null || schedule.day === null || schedule.hour === null) {
    removeSchedule({url: name})
    return;
  }
  console.log('has schedule', entry.schedule)
  scheduleOn(event, entry, 'schedule');
};

const modelActions = {
  kiosk: kioskTasks,
  schedule: scheduleOn,
  'off-schedule': scheduleOff,
};

app.post('/api', function (req, res) {
  const body = req.body;
  const entry = body.entry;
  const model = body.model;
  const event = body.event;

  modelActions[model](event, entry, model);

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  console.log('getting stuff')
  res.sendFile(__dirname);
});

eventEmitter.on('route', url => {
  console.log('event triggered', url);

  if(!url) return;
  ws.send(url);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  // refresh browser
  setTimeout(() => {
    console.log('refreshing');
    shell.exec('sh ~/kiosk/shell-scripts/refresh-browser.sh');
  }, 1000);

  setTimeout(() => {
    startup();
  }, 3000);
});
