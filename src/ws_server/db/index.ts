

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
  private _prepareData(type: MSG_TYPE, data: unknown) {
    return JSON.stringify({
      type,
      data: JSON.stringify(data),
      id: 0,
    });
  }

  public registerPlayer(playerData: TPlayer, connectionID: string): string {
    const { player, index } = this._getUserByName(playerData.name);

    if (index < 0) {
      const playerID = idGen();

      this._players.push({
        ...playerData,
        index: playerID,
        connectionID,
        winsCount: Math.round(Math.random())
      });

      return this._prepareData(MSG_TYPE.REG, {
        name: playerData.name,
        index: playerID,
        error: false,
        errorText: ''
      });
    } else if (player?.name === playerData.name && player.password !== playerData.password) {
      return this._prepareData(MSG_TYPE.REG, {
        ...player,
        error: true,
        errorText: 'Wrong password'
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

      return this._prepareData(MSG_TYPE.UPDATE_ROOM, this.rooms);
    }
  }

  public getRoomsData() {
    return this._prepareData(MSG_TYPE.UPDATE_ROOM, this.rooms);
  }

  public getWinnersTable() {
    const data = this._players.sort((playerA, playerB) =>
      playerA.winsCount - playerB.winsCount)
      .map(el => JSON.stringify({ name: el.name, wins: el.winsCount }));

    return this._prepareData(MSG_TYPE.UPDATE_WINNERS, data);
  }
}

export const gameDB = new GameDB();


