import { IGameState, GameType, PlayerPositions, GameActionType, PawnsInfo, GameStatus } from "../../models/gameState";
import { IDefaultAction } from "../../models/reduxModel";
import IActionTypes from "../actions/types";
import { IStartGamePayload, IUpdatePositionsPayload } from "../../models/actionsModel";

const initialState: IGameState = {
    gameId: '',
    playerId: '',
    isCurrentPlayer: false,
    areAllItemsPlaced: false,
    gameType: GameType.None,
    gameActionType: GameActionType.None,
    pawnsInfo: {},
    gamePositions: {},
    pawnContent: new Array(24),
    pawnsToRemove: [],
    gameStatus: GameStatus.New
}

const gameReducer = (state: IGameState = initialState, action: IDefaultAction<any>): IGameState => {
    switch (action.type) {
        case IActionTypes.START_GAME:
            const startGamePayload = action.payload as IStartGamePayload;
            const playerPositions = startGamePayload.playerIds.reduce((acc, playerId) => {
                acc[playerId] = {};
                return acc;
            }, {} as PlayerPositions);

            const pawnsInfo = startGamePayload.playerIds.reduce((acc, playerId) => {
                acc[playerId] = {
                    available: 9,
                    unavailable: 0,
                    symbol: playerId === '0' ? 'O' : 'X'
                };
                return acc;
            }, {} as PawnsInfo);

            const isCurrentGamePlayer = startGamePayload.startingPlayerId === startGamePayload.thisPlayerId;

            return {
                ...initialState,
                gameId: startGamePayload.gameId,
                playerId: startGamePayload.thisPlayerId,
                gameType: startGamePayload.gameType,
                isCurrentPlayer: isCurrentGamePlayer,
                gamePositions: playerPositions,
                pawnsInfo: pawnsInfo,
                gameStatus: GameStatus.InProgress,
                wonBy: '',
                gameActionType: isCurrentGamePlayer ? GameActionType.Insert : GameActionType.None
            }
        
        case IActionTypes.UPDATE_PAWN_POSITIONS:
            const updatePawnPositionPayload = action.payload as IUpdatePositionsPayload;
            const isCurrentGamePlayerToPlay = updatePawnPositionPayload.playerIdToPlay === updatePawnPositionPayload.thisPlayerId;
        
            return {
                ...state,
                playerId: updatePawnPositionPayload.thisPlayerId,
                isCurrentPlayer: isCurrentGamePlayerToPlay,
                gamePositions: updatePawnPositionPayload.playerPositions,
                pawnsInfo: updatePawnPositionPayload.pawnsInfo,
                pawnContent: updatePawnPositionPayload.pawnContent,
                gameActionType: isCurrentGamePlayerToPlay ? updatePawnPositionPayload.gameActionType : GameActionType.None,
                pawnsToRemove: updatePawnPositionPayload.pawnsToRemove ? updatePawnPositionPayload.pawnsToRemove: []
            }

        case IActionTypes.GAME_COMPLETED:
            return {
                ...state,
                wonBy: action.payload,
                gameStatus: GameStatus.Completed
            }
        default:
           return state;
    }
}


export default gameReducer;