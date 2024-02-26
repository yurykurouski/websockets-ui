import { messenger } from "..";
import { Messenger } from "../messenger";
import { Player } from "../models/Player";
import { Room } from "../models/Room";
import { WSConnection } from "../types";

export class GameController {
  public rooms: Room[];
  private _players: Player[];
  public messenger: Messenger;

  constructor() {
    this.rooms = [];
    this._players = [];
    this.messenger = messenger;
  }

  private _getUserByConnectionId(connectionID: string): { player?: Player, index: number } {
    const index = this._players.findIndex((player) => player.index === connectionID);

    return { player: this._players[index], index };
  }

  private _getRoomById(id: string) {
    return this.rooms.find(room => room.roomId === id);
  }

  public registerPlayer(data: string, ws: WSConnection) {
    const { name, password } = JSON.parse(data);

    const { player } = this._getUserByConnectionId(ws.id);

    if (!player) {
      const newPlayer = new Player({ name, password }, ws);

      this._players.push(newPlayer);

      return {
        name: newPlayer.name,
        index: newPlayer.index,
        error: false,
        errorText: ''
      };
    } else if (player.name === name && player.password !== password) {
      return {
        name: player.name,
        index: player.index,
        error: true,
        errorText: 'Wrong password'
      };
    } else {
      return {
        name: player.name,
        index: player.index,
        error: false,
        errorText: ''
      };
    }
  }

  public getWinnersTable() {
    return [...this._players].sort((playerA, playerB) =>
      playerA.winsCount - playerB.winsCount)
      .filter(el => el.winsCount !== 0)
      .map(el => JSON.stringify({ name: el.name, wins: el.winsCount }));
  }

  public createRoom(connectionID: string) {
    const { player } = this._getUserByConnectionId(connectionID);

    if (player) {
      const newRoom = new Room(player);

      this.rooms.push(newRoom);
    }
  }

  public addUserToRoom(data: string, connectionID: string) {
    const { indexRoom } = JSON.parse(data);
    const { player } = this._getUserByConnectionId(connectionID);

    if (player) {
      this.rooms.forEach((room) => {
        if (room.roomId === indexRoom) {
          room.addUser(player);
        }
      });
    }
  }

  public createGame(data: string, connectionID: string) {
    const { indexRoom } = JSON.parse(data);

    const { player } = this._getUserByConnectionId(connectionID);

    if (player) {
      return {
        idGame: indexRoom,
        idPlayer: player.index,
      };
    }
  }

  public addShips(data: string) {
    const { gameId, indexPlayer, ships } = JSON.parse(data);

    const game = this.rooms.find(room => room.roomId === gameId);
    return game?.addShips(indexPlayer, ships);
  }

  public getUserShips(connectionID: string) {
    const { player } = this._getUserByConnectionId(connectionID);

    if (player) {
      return player.getShips;
    }
  }

  public turn(data: string) {
    const { gameId } = JSON.parse(data);

    const room = this._getRoomById(gameId);
    if (room) {
      return room?.turn();
    }
  }

  public attack(data: string) {
    const { x, y, gameId, indexPlayer } = JSON.parse(data);

    const room = this._getRoomById(gameId);

    if (room) {
      return room.attack({ x, y }, indexPlayer);
    }
  }
}

