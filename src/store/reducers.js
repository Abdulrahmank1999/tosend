// import { combineReducers } from "redux";
import * as types from "./actionTypes";

const initialAuthState = {
  username: null,
  userId: null,
  token: null,
};

const AuthReducer = (state = initialAuthState, { type, payload }) => {
  switch (type) {
    case types.USER_DETAIL:
      return {
        ...state,
        token: payload.token,
        username: payload.username,
        userId: payload.userId,
      };

    default:
      return state;
  }
};

export default AuthReducer;
