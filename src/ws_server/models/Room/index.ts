import { Ship } from "../../types";
import { fillBattlefield, idGen } from "../../utils";
import { Player } from "../Player";


export class Room {
  public roomUsers: Player[];
  public roomId: string;
  private _usersReady: number;
  public battlefield: { [key: string]: Ship[] };
  public currentPlayerIndex: number;

  constructor(player: Player) {
    this.roomId = idGen();
    this.roomUsers = [];
    this._usersReady = 0;
    this.currentPlayerIndex = 0;
    this.battlefield = {};
  }

  public addUser(player: Player) {
    this.roomUsers.push(player);
    return this.roomUsers;
  }

  public addShips(userId: string, ships: Ship[]) {
    const player = this.roomUsers.find(player => player.index === userId);

    const test = fillBattlefield(ships);

    if (player) {
      player.ships = ships;
      player.gameId = this.roomId;

      this.battlefield[userId] = ships;

      this._usersReady++;
    }

    return {
      isAllUsersReady: this._usersReady === 2,
      ships: this.battlefield
    };
  }

  public turn() {
    this.currentPlayerIndex = this.currentPlayerIndex ? 1 : 0;

    return { currentPlayer: this.roomUsers[this.currentPlayerIndex].index };
  }

  public attack({ x, y }: { x: number, y: number }, indexPlayer: string) {
    const oppositePlayerIndex = this.roomUsers.find(player => player.index !== indexPlayer)?.index;
    const ships = this.battlefield[oppositePlayerIndex!];

    const ship = ships.find(({ position }) => {
      return position.x === x && position.y === y;
    });

    return {
      position: { x, y },
      currentPlayer: indexPlayer,
      status: 'miss'
    };
  }
}