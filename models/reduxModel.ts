import IActionTypes from "../store/actions/types";

export interface IDefaultAction<T> {
    type: string,
    payload: T
}