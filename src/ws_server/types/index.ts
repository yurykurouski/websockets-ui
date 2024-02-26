import WebSocket from "ws";

import { ESHIP_TYPE, MSG_TYPE } from "../constants";

export type TPlayer = {
  name: string;
  password: string;
  connectionID: string
  index: string,
  winsCount: number
}

export type TMessage<T> = {
  type: MSG_TYPE,
  data: T,
  id: 0
}

export type TPlayerData = {
  name: string,
  index: number,
  error: boolean,
  errorText: string
}

export type WSConnection = WebSocket & {
  id: string;
  isRegistered: boolean;
}

export type BufferLike =
  | string
  | Buffer
  | DataView
  | number
  | ArrayBufferView
  | Uint8Array
  | ArrayBuffer
  | SharedArrayBuffer
  | readonly any[]
  | readonly number[]
  | { valueOf(): ArrayBuffer }
  | { valueOf(): SharedArrayBuffer }
  | { valueOf(): Uint8Array }
  | { valueOf(): readonly number[] }
  | { valueOf(): string }
  | { [Symbol.toPrimitive](hint: string): string };

export type Ship = {
  position: {
    x: number,
    y: number
  },
  direction: boolean,
  length: number,
  type: ESHIP_TYPE
}