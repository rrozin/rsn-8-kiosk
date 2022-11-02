import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import WebSocket, { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { addSchedule, updateSchedule, removeSchedule } from './cron-tasks.js';

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

  socket.send('testing');
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

app.post('/', function (req, res) {
  const actions = {
    ADD: param => addSchedule({id: param.id, schedule: param.schedule}),
    UPDATE: param => updateSchedule({id: param.id, schedule: param.schedule}),
    REMOVE: param => removeSchedule({id: param.id, schedule: param.schedule})
  };
  const body = req.body;

  if (ws) ws.send(`Welcome! ${body.type}`);
  // console.log(req.body)
  actions[body.type](body.data)

  res.sendStatus(200);
});

// addSchedule({id: 'addNew', schedule: '30 * * * * *'});

app.get('/', (req, res) => {
  res.sendFile(__dirname);
});

// setTimeout(() => {
//   ws.send('Hello world!');
// }, 5000);

server.listen(3000, () => {
  console.log('listening on *:3000');
});