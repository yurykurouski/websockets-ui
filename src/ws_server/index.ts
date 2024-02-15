
import { WebSocketServer } from 'ws';

import { Messenger } from './messenger';
import { WSConnection } from './types';


const wss = new WebSocketServer({ port: 3000 });
const messenger = new Messenger();

wss.on('connection', (ws: WSConnection) => {
  messenger.init(ws);

  ws.on('message', (msg) => messenger.handleMessage(msg, ws));
  ws.on('close', (code, reason) => messenger.handleClose(code, reason, ws));
  ws.on('error', (err) => messenger.handleError(err, ws));
});
