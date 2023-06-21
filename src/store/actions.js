import * as types from "./actionTypes.js";
import axios from "axios";
import { notification } from "antd";

export const userLogin = (token, userId, username) => {
  return (dispatch) => {
    dispatch({
      type: types.USER_DETAIL,
      payload: {
        token: token,
        userId: userId,
        username: username,
      },
    });
  };
};

export const userLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  return (dispatch) => {
    dispatch({
      type: types.USER_DETAIL,
      payload: {
        token: null,
        userId: null,
        username: null,
      },
    });
  };
};

export const userDetail = (values) => {
  return (dispatch) => {
    axios
      .post("http://godesignapi.ranuvijay.me/login", {
        username: values.username,
        password: values.password,
      })
      .then((r) => {
        axios
          .get("http://godesignapi.ranuvijay.me/user", {
            headers: {
              Authorization: "Bearer " + r.data.access_token,
            },
          })
          .then((dd) => {
            localStorage.setItem("token", r.data.access_token);
            localStorage.setItem("userId", dd.data.id);
            localStorage.setItem("username", dd.data.username);

            dispatch({
              type: types.USER_DETAIL,
              payload: {
                token: r.data.access_token,
                userId: dd.data.id,
                username: dd.data.username,
              },
            });
          });
      })
      .catch((e) => {
        notification["error"]({
          message: "Error !!",
          description: "Wrong credentials !!",
        });
        dispatch({
          type: types.USER_DETAIL,
          payload: {
            token: null,
          },
        });
      });
  };
};

export const ConsoleMenu = (consoleMenu) => {
  return (dispatch) => {
    dispatch({
      type: types.CONSOLE_MENU,
      payload: {
        consoleMenu: consoleMenu,
        // userData: userData,
        // tenant: tenant,
        // permissions: permissions,
      },
    });

    // dispatch(consoleMenu(consoleMen));
  };
};
