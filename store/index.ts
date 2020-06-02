import { createStore, combineReducers } from "redux";
import { IStoreModel } from "../models/gameState";
import gameReducer from "./reducers/gameReducer";
import pawnElementsReducer from "./reducers/pawnElementsReducer";
import { IDefaultAction } from "../models/reduxModel";

const rootReducer = combineReducers<IStoreModel>({
    game: gameReducer,
    pawnElementsPosition: pawnElementsReducer
})

const store = createStore<IStoreModel, IDefaultAction<any>, null, null>(rootReducer);

export default store;