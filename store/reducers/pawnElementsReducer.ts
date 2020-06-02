import { IPawnElementDOMPositions } from "../../models/gameState";
import { IDefaultAction } from "../../models/reduxModel";
import IActionTypes from '../actions/types';

const pawnElementsReducer = (state: IPawnElementDOMPositions = {}, action: IDefaultAction<any>): IPawnElementDOMPositions => {
   
    switch(action.type) {
        case IActionTypes.SET_PAWN_ELEMENT_POSITION :
            return {...state, [action.payload.containerIndex]: {
                x: action.payload.x,
                y: action.payload.y,
                pawnId: action.payload.containerIndex
            }}
        default:
            return state;
    }
};

export default pawnElementsReducer;