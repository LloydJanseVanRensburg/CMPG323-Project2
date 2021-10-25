import * as actionTypes from './authTypes';

export const authReducer = (state: any, action: any) => {
  switch (action.type) {
    // GET LOGGED IN USER DATA
    case actionTypes.GET_AUTH_USER_LOADING:
      return {
        ...state,
        getUserLoading: true,
      };
    case actionTypes.GET_AUTH_USER_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        isLoggedIn: true,
        getUserLoading: false,
      };
    case actionTypes.GET_AUTH_USER_FAIL:
      return {
        ...state,
        userData: null,
        isLoggedIn: false,
        getUserLoading: false,
        getUserError: action.payload,
      };

    // LOGIN USER
    case actionTypes.LOGIN_USER_LOADING:
      return {
        ...state,
        loginUserLoading: true,
      };
    case actionTypes.LOGIN_USER_SUCCESS:
      return {
        ...state,
        loginUserLoading: false,
        userData: action.payload,
        isLoggedIn: true,
      };
    case actionTypes.LOGIN_USER_FAIL:
      return {
        ...state,
        loginUserLoading: false,
        userData: null,
        isLoggedIn: false,
        loginUserError: action.payload,
      };

    // REGISTER USER
    case actionTypes.REGISTER_USER_LOADING:
      return {
        ...state,
        registerUserLoading: true,
      };
    case actionTypes.REGISTER_USER_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        registerUserLoading: false,
        isLoggedIn: true,
      };
    case actionTypes.REGISTER_USER_FAIL:
      return {
        ...state,
        registerUserLoading: false,
        userData: null,
        isLoggedIn: false,
        registerUserError: action.payload,
      };

    // LOGOUT USER
    case actionTypes.LOGOUT_USER:
      return {
        ...state,
        userData: null,
        isLoggedIn: false,
      };

    // DEFAULT RETURN
    default:
      return state;
  }
};
