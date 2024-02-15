

import { idGen } from "../../utils";
import { MSG_TYPE } from "../constants";
import { TPlayer } from "../types";

type TRoom = {
  roomID: string
  roomUsers: TPlayer[],
}

class GameDB {
  private _players: TPlayer[];
  private _rooms: TRoom[];

  constructor() {
    this._players = [];
    this._rooms = [];
  }

  private get rooms(): TRoom[] {
    return this._rooms;
  }

  private _getUserByConnectionId(connectionID: string): TPlayer | undefined {
    return this._players.find(p => p.connectionID === connectionID);
  }
  private _getUserByName(name: string): { player: TPlayer, index: number } {
    const index = this._players.findIndex(p => p.name === name);

    return { player: this._players[index], index };
  }

  public registerPlayer(playerData: TPlayer, connectionID: string): string | undefined {
    const { player, index } = this._getUserByName(playerData.name);

    if (index < 0) {
      const playerID = idGen();

      this._players.push({
        ...playerData,
        index: playerID,
        connectionID,
        winsCount: Math.round(Math.random())
      });

      return JSON.stringify({
        type: MSG_TYPE.REG,
        data: JSON.stringify({
          name: playerData.name,
          index: playerID,
          error: false,
          errorText: ''
        }),
        id: 0
      });
    } if (player?.name === playerData.name && player.password !== playerData.password) {
      return JSON.stringify({
        type: MSG_TYPE.REG,
        data: JSON.stringify({
          ...player,
          error: true,
          errorText: 'Wrong password'
        }),
        id: 0
      });
    }
  }

  public createRoom(connectionID: string) {
    const creator = this._getUserByConnectionId(connectionID);

    if (creator) {
      const roomID = idGen();

      const room = {
        roomID,
        roomUsers: [{ name: creator.name, index: creator.index }]
      } as TRoom;

      this._rooms.push(room);

      return {
        type: MSG_TYPE.UPDATE_ROOM,
        data: JSON.stringify(this.rooms),
        id: 0
      };
    }
  }

  public getRoomsData() {
    return JSON.stringify({
      type: MSG_TYPE.UPDATE_ROOM,
      data: JSON.stringify(this.rooms),
      id: 0
    });
  }

  public getWinnersTable() {
    const data = JSON.stringify(
      this._players.sort((playerA, playerB) =>
        playerA.winsCount - playerB.winsCount)
        .map(el => JSON.stringify({ name: el.name, wins: el.winsCount })));

    return JSON.stringify({
      type: MSG_TYPE.UPDATE_WINNERS,
      data,
      id: 0
    });
  }
}

export const gameDB = new GameDB();


