import { Ship, WSConnection } from "../../types";


export class Player {
  public name: string;
  public password: string;
  public index: string;
  public winsCount: number;
  public _ships: Ship[];
  private _gameId: string;

  constructor({ name, password }: { name: string, password: string }, ws: WSConnection) {
    this.name = name;
    this.password = password;
    this.index = ws.id;
    this.winsCount = 0;
    this._ships = [];
    this._gameId = '';

    ws.isRegistered = true;
  }

  public increaseWinsCount(): number {
    this.winsCount += 1;

    return this.winsCount;
  }

  public set ships(ships: Ship[]) {
    this._ships = ships;
  }

  public set gameId(gameId: string) {
    this._gameId = gameId;
  }

  public get getShips() {
    return this._ships;
  }
}