import { MSG_TYPE } from "../constants";
import { Ship } from "../types";


export const idGen = () => (Date.now() * Math.random()).toFixed();

export const prepareData = (type: MSG_TYPE, data: unknown) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
};

export const fillBattlefield = (ships: Ship[]) => {
  const battlefield = new Array(10).fill(0).map(() => new Array(10).fill(0));
  console.log('ships: ', ships);
  for (const { position: { x, y }, length, direction } of ships) {
    battlefield[y][x] = 1;

    for (let i = 1; i < length - 1; i++) {
      if (!direction) {
        battlefield[y][x + i] = 1;
      } else {
        battlefield[y + i][x] = 1;
      }
    }
  }

  return battlefield;
};

//true => left holriontal


