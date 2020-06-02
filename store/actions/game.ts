import IActionTypes from "./types"
import { IStartGamePayload, IUpdatePositionsPayload } from "../../models/actionsModel"
import { GameType, PlayerPositions, PawnsInfo, GameActionType, IGameState, IStoreModel } from "../../models/gameState";
import store from "..";
import { Store } from "redux";
import gameHelper from '../../helpers/gamePositions';

const playerIds = ['0', '1'];
export const startGame = () => {

    const startGamePayload: IStartGamePayload = {
        gameId: '1234',
        thisPlayerId: playerIds[0],
        playerIds: playerIds,
        startingPlayerId: playerIds[0],
        gameType: GameType.Alternate
    }

    return {
        type: IActionTypes.START_GAME,
        payload: startGamePayload
    }
}


const fetchStateInfo = () => {
    const {dispatch, getState} = (store as Store);
    const {game: {  
                    gamePositions: StoreGamePositions, 
                    pawnsInfo: storePawnsInfo,
                    pawnContent: storePawnContent
                }} = (getState() as IStoreModel);

    const gamePositions = {...StoreGamePositions};
    const pawnsInfo = {...storePawnsInfo};
    const pawnContent = {...storePawnContent};

    return {
        dispatch, 
        gamePositions, 
        pawnsInfo, 
        pawnContent
    }
}

const checkIfDaddy = (symbol: string, pawnPosition: number, pawnContent: string[] | undefined[]) => {
   const possibleDadyPositions = gameHelper.scorePointsByIndex[pawnPosition];

    return possibleDadyPositions
                .some(t => t.every(x => pawnContent[x] && pawnContent[x] === symbol));
    
}

const getInsertedCount = (pawnsInfo: PawnsInfo) => {
   return Object.keys(pawnsInfo).reduce((acc, k) => { 
        acc += pawnsInfo[k].available;
        return acc;
    }, 0)
}

const pawnsThatCanBeRemoved = (playerIdPawnsToRemove: string, pawnInfo: PawnsInfo, gamePositions: PlayerPositions, pawnContent: string[] | undefined[]): number[] => {
    const playerPawnsToRemove = gamePositions[playerIdPawnsToRemove];
    let pawnsThatCanBeRemoved: number[] = [];

    // check if in daddy, then dont add
    pawnsThatCanBeRemoved = Object.keys(playerPawnsToRemove)
                                    .map(t => parseInt(t))
                                    .filter(pawnId => !checkIfDaddy(pawnInfo[playerIdPawnsToRemove].symbol, pawnId, pawnContent));
    
    if(pawnsThatCanBeRemoved.length === 0)
        return  Object.keys(playerPawnsToRemove)
                        .map(t => parseInt(t));

    return pawnsThatCanBeRemoved;
    
}

export const insertPlayerPawn = (playerId: string, pawnPosition: number) => {
    const {dispatch, gamePositions, pawnContent, pawnsInfo} = fetchStateInfo();
    const otherPlayerId = playerIds.find(t => t !== playerId) || '';
    const playerSymbol = pawnsInfo[playerId].symbol;

    if(pawnsInfo[playerId]) {
        pawnsInfo[playerId].available--;
    }
    pawnContent[pawnPosition] =  playerSymbol;

    gamePositions[playerId][pawnPosition] = pawnPosition;
    const isDaddy = checkIfDaddy(playerSymbol, pawnPosition, pawnContent);

    const totalPawnsAvailable = getInsertedCount(pawnsInfo);

    const payload: IUpdatePositionsPayload = {
        thisPlayerId: isDaddy ? playerId: otherPlayerId,
        playerIdToPlay: isDaddy ? playerId: otherPlayerId,
        pawnsInfo: pawnsInfo,
        gameActionType: isDaddy ? GameActionType.Remove : totalPawnsAvailable !== 0 ? GameActionType.Insert : GameActionType.Move,
        playerPositions: gamePositions,
        pawnContent: pawnContent,
        pawnsToRemove: isDaddy ? pawnsThatCanBeRemoved(otherPlayerId, pawnsInfo, gamePositions, pawnContent): []
    }

    dispatch({
        type: IActionTypes.UPDATE_PAWN_POSITIONS,
        payload: payload
    });
}



export const movePlayerPawn = (playerId: string, moveFrom: number, moveTo: number) => {
    const {dispatch, gamePositions, pawnContent, pawnsInfo} = fetchStateInfo();
    const otherPlayerId = playerIds.find(t => t !== playerId) || '';
    const playerSymbol = pawnsInfo[playerId].symbol;
    // Update pawn content
    pawnContent[moveTo] =  playerSymbol;
    pawnContent[moveFrom] = undefined;

    // update player content
    gamePositions[playerId][moveTo] = moveTo;
    delete gamePositions[playerId][moveFrom];

    const isDaddy = checkIfDaddy(playerSymbol, moveTo, pawnContent);

    const payload: IUpdatePositionsPayload = {
        thisPlayerId: isDaddy ? playerId: otherPlayerId,
        playerIdToPlay: isDaddy ? playerId: otherPlayerId,
        pawnsInfo: pawnsInfo,
        gameActionType: isDaddy ? GameActionType.Remove: GameActionType.Move,
        playerPositions: gamePositions,
        pawnContent: pawnContent,
        pawnsToRemove: isDaddy ? pawnsThatCanBeRemoved(otherPlayerId, pawnsInfo, gamePositions, pawnContent): []
    }

    dispatch({
        type: IActionTypes.UPDATE_PAWN_POSITIONS,
        payload: payload
    });
}

export const removePlayerPawns = (pawnRemovedBy: string, pawnRemoved: number) => {
    const {dispatch, gamePositions, pawnContent, pawnsInfo} = fetchStateInfo();
    const otherPlayerId = playerIds.find(t => t !== pawnRemovedBy) || '';
   
    if(pawnsInfo[otherPlayerId]) {
        pawnsInfo[otherPlayerId].unavailable++;
    }
    pawnContent[pawnRemoved] = undefined;
    delete gamePositions[otherPlayerId][pawnRemoved];

    // Is Game Completed
    if(pawnsInfo[otherPlayerId].unavailable > 6) {
        dispatch({
            type: IActionTypes.GAME_COMPLETED,
            payload: pawnRemovedBy
        })
    } else {
        const payload: IUpdatePositionsPayload = {
            thisPlayerId: otherPlayerId,
            playerIdToPlay: otherPlayerId,
            pawnsInfo: pawnsInfo,
            gameActionType: getInsertedCount(pawnsInfo) === 0 ? GameActionType.Move: GameActionType.Insert,
            playerPositions: gamePositions,
            pawnContent: pawnContent   
        }

        dispatch({
            type: IActionTypes.UPDATE_PAWN_POSITIONS,
            payload: payload
        });
    }
}