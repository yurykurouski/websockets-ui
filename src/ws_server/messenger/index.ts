
import WebSocket from "ws";

import { idGen } from "../../utils";
import { MSG_TYPE } from "../constants";
import { gameDB } from "../db";
import { WSConnection } from "../types";

export class Messenger {
  private _connections: WSConnection[];

  constructor() {
    this._connections = [];
  }

  public init(ws: WSConnection) {
    const id = idGen();

    ws.id = id;
    this._connections.push(ws);

    console.log(`${id} is connected`);
  }

  public handleMessage = (msg: WebSocket.RawData, ws: WSConnection) => {
    const parsed = JSON.parse(msg.toString());

    switch (parsed.type) {
      case MSG_TYPE.REG:
        ws.send(gameDB.registerPlayer(JSON.parse(parsed.data), ws.id));
        this.updateRoom();
        gameDB.getWinnersTable();
        break;
      case MSG_TYPE.CREATE_ROOM:
        gameDB.createRoom(ws.id);
        this.updateRoom();
        break;
    }
  };

  private updateRoom() {
    this._connections.forEach(ws => ws.send(gameDB.getRoomsData()));
  }

  public handleClose(code: number, reason: Buffer, ws: WSConnection) {
    console.log(`${ws.id} is disconnected because of ${reason}${[code]}`);

    ws.close();
  }
  public handleError(err: Error, ws: WSConnection) {
    console.error(`${ws.id} ERROR: ${err}`);
  }
}



