// Core React
import { useReducer, useCallback } from 'react';

// AuthContext
import { AuthContext } from './authContext';

// AuthReducer
import { authReducer } from './autReducer';

// Auth Action Types
import * as actionTypes from './authTypes';

// Interfaces
import { RegisterPayload, LoginPayload } from '../../interfaces/interfaces';

// Axios & Module
import axios from 'axios';
import { config } from '../../constants/config';

const AuthState: React.FC = ({ children }) => {
  const authInitialReducerState = {
    userData: null,
    isLoggedIn: false,

    getUserLoading: false,
    getUserError: '',

    loginUserLoading: false,
    loginUserError: '',

    registerUserLoading: false,
    registerUserError: '',
  };

  const [state, dispatch] = useReducer(authReducer, authInitialReducerState);

  // In callback because this function gets called from useEffect in App.tsx
  const getCurrentUserFromToken = useCallback(async () => {
    dispatch({ type: actionTypes.GET_AUTH_USER_LOADING });

    try {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      const result: any = await axios.get(
        `${config.apiURL}/auth/logged-in`,
        axiosConfig
      );

      dispatch({
        type: actionTypes.GET_AUTH_USER_SUCCESS,
        payload: {
          id: result.data.data.user.id,
          email: result.data.data.user.email,
          name: result.data.data.user.name,
          profilePicture: result.data.data.user.profilePicture,
        },
      });
    } catch (error: any) {
      // Remove Auth Token from localstorage
      localStorage.removeItem('authToken');
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.GET_AUTH_USER_FAIL, payload: message });
    }
  }, []);

  const registerUser = async (registerPayload: RegisterPayload) => {
    try {
      dispatch({ type: actionTypes.REGISTER_USER_LOADING });

      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Login into backend
      const result: any = await axios.post(
        `${config.apiURL}/auth/register`,
        registerPayload,
        axiosConfig
      );

      if (result.data.success) {
        localStorage.setItem('authToken', result.data.data.token);
        dispatch({
          type: actionTypes.REGISTER_USER_SUCCESS,
          payload: {
            id: result.data.data.user.id,
            email: result.data.data.user.email,
            name: result.data.data.user.name,
            profilePicture: result.data.data.user.profilePicture,
          },
        });
      }
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.REGISTER_USER_FAIL, payload: message });
    }
  };

  const loginUser = async (loginPayload: LoginPayload) => {
    try {
      dispatch({ type: actionTypes.LOGIN_USER_LOADING });

      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Login into backend
      const result: any = await axios.post(
        `${config.apiURL}/auth/login`,
        loginPayload,
        axiosConfig
      );

      if (result.data.success) {
        localStorage.setItem('authToken', result.data.data.token);
        dispatch({
          type: actionTypes.LOGIN_USER_SUCCESS,
          payload: {
            id: result.data.data.user.id,
            email: result.data.data.user.email,
            name: result.data.data.user.name,
            profilePicture: result.data.data.user.profilePicture,
          },
        });
      }
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.LOGIN_USER_FAIL, payload: message });
    }
  };

  const logoutUser = () => {
    dispatch({ type: actionTypes.LOGOUT_USER });
    localStorage.removeItem('authToken');
  };

  function setLoginUserError(message: string) {
    dispatch({
      type: actionTypes.LOGIN_USER_FAIL,
      payload: message,
    });
  }

  const setRegisterUserError = (message: string) => {
    dispatch({
      type: actionTypes.REGISTER_USER_FAIL,
      payload: message,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        userData: state.userData,
        isLoggedIn: state.isLoggedIn,
        getUserLoading: state.getUserLoading,
        getUserError: state.getUserError,
        loginUserLoading: state.loginUserLoading,
        loginUserError: state.loginUserError,
        registerUserLoading: state.registerUserLoading,
        registerUserError: state.registerUserError,
        getCurrentUserFromToken,
        registerUser,
        loginUser,
        logoutUser,
        setLoginUserError,
        setRegisterUserError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
