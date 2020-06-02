export interface IGameState {
  gameId: string;
  playerId: string;
  isCurrentPlayer: boolean;
  areAllItemsPlaced: boolean;
  gameType: GameType;
  gamePositions: PlayerPositions;
  pawnsInfo: PawnsInfo,
  gameActionType: GameActionType;
  pawnContent: string[]|undefined[],
  pawnsToRemove: number[],
  gameStatus: GameStatus,
  wonBy?: string
}

export type PawnsInfo = {
    [playerPositions: string]: {
        available: number,
        unavailable: number,
        symbol: string
      };
}

export type PlayerPositions = {
  [playerPositions: string]: {
    [pawnId: number]: number;
  };
};

export enum GameStatus {
  New,
  InProgress,
  Completed,
  Abondoned
}

export enum GameActionType {
    Insert,
    Remove,
    Move,
    None
}

export enum GameType {
  Alternate,
  WithFriends,
  None,
}

export interface IPawnElementDOMPositions {
  [pawnId: number]: {
    pawnId: number;
    x: number;
    y: number;
  };
}

export interface IStoreModel {
  game: IGameState;
  pawnElementsPosition: IPawnElementDOMPositions;
}
