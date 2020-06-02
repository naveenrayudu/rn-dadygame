import { GameType, PlayerPositions, PawnsInfo, GameActionType } from "./gameState";

export interface IStartGamePayload{
    gameId: string,
    thisPlayerId: string,
    startingPlayerId: string,
    playerIds: string[],
    gameType: GameType
}

export interface IUpdatePositionsPayload {
    thisPlayerId: string,
    playerIdToPlay: string,
    playerPositions: PlayerPositions,
    pawnsInfo: PawnsInfo,
    gameActionType: GameActionType,
    pawnContent: string[]|undefined[],
    pawnsToRemove?: number[]
}