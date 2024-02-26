import WebSocket from "ws";

import { MSG_TYPE } from "../constants";
import { GameController } from "../controller/GameController";
import { BufferLike, WSConnection } from "../types";
import { idGen, prepareData } from "../utils";

export class Messenger {
  private _connections: WSConnection[];
  private gameController: GameController;

  constructor() {
    this._connections = [];
    this.gameController = new GameController();
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
      case MSG_TYPE.REG: {
        const playerData = this.gameController.registerPlayer(parsed.data, ws);
        ws.send(prepareData(MSG_TYPE.REG, playerData));

        this._sendToAll(
          prepareData(MSG_TYPE.UPDATE_ROOM, this.gameController.rooms),
          prepareData(MSG_TYPE.UPDATE_WINNERS, this.gameController.getWinnersTable())
        );
        break;
      }
      case MSG_TYPE.CREATE_ROOM:
        this.gameController.createRoom(ws.id);

        this._sendToAll(
          prepareData(MSG_TYPE.UPDATE_ROOM, this.gameController.rooms),
          prepareData(MSG_TYPE.UPDATE_WINNERS, this.gameController.getWinnersTable())
        );
        break;
      case MSG_TYPE.ADD_USER_TO_ROOM:
        this.gameController.addUserToRoom(parsed.data, ws.id);

        ws.send(prepareData(MSG_TYPE.UPDATE_ROOM, this.gameController.rooms));
        ws.send(prepareData(MSG_TYPE.CREATE_GAME, this.gameController.createGame(parsed.data, ws.id)));
        break;
      case MSG_TYPE.ADD_SHIPS: {
        const data = this.gameController.addShips(parsed.data);

        if (data?.isAllUsersReady) {
          Object.entries(data.ships).forEach(([currentPlayerIndex, ships]) => {
            this._sendTo(currentPlayerIndex, prepareData(MSG_TYPE.START_GAME, { ships, currentPlayerIndex }));
            this._sendTo(currentPlayerIndex, prepareData(MSG_TYPE.TURN, this.gameController.turn(parsed.data)));
          });
        }
        break;
      }
      case MSG_TYPE.ATTACK: {
        const data = prepareData(MSG_TYPE.ATTACK, this.gameController.attack(parsed.data));
        this._sendToAll(data, prepareData(MSG_TYPE.TURN, this.gameController.turn(parsed.data)));
        break;
      }
    }
  };

  private _sendTo(connectionId: string, data: string) {
    const ws = this._connections.find(conn => conn.id === connectionId);

    if (ws) {
      ws.send(data);
    }
  }

  private _sendToAll(...args: BufferLike[]) {
    this._connections.forEach(ws => args.forEach(arg => ws.isRegistered && ws.send(arg)));
  }

  public handleClose(code: number, reason: Buffer, ws: WSConnection) {
    console.log(`${ws.id} is disconnected because of ${reason}${[code]}`);

    ws.close();
  }
  public handleError(err: Error, ws: WSConnection) {
    console.error(`${ws.id} ERROR: ${err}`);
  }
}
