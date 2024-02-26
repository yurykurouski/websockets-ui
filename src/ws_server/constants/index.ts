export enum MSG_TYPE {
  REG = 'reg',
  UPDATE_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  CREATE_GAME = 'create_game',
  UPDATE_ROOM = 'update_room',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  TURN = 'turn',
  ATTACK = 'attack'
}

export enum ESHIP_TYPE {
  HUGE = 'huge',
  MEDIUM = 'medium',
  SMALL = 'small',
  LARGE = 'large'
}

export enum EATTACK_STATUS {
  MISS = "miss",
  KILLED = "killed",
  SHOT = "shot"
}