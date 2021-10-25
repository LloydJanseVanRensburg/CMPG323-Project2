import axios from 'axios';
import { useReducer, useCallback } from 'react';
import { config } from '../../constants/config';
import { groupsReducer } from '../Groups/groupsReducer';
import { GroupsContext } from './groupsContext';
import * as actionTypes from './groupsTypes';

const GroupsState: React.FC = ({ children }) => {
  const initialGroupsState = {
    groupsDataLoading: false,
    groupsDataError: '',
    groupsData: [],
  };

  const [state, dispatch] = useReducer(groupsReducer, initialGroupsState);

  const getUserGroupsData = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    try {
      dispatch({ type: actionTypes.GET_ALL_USER_GROUPS_LOADING });

      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: any = await axios.get(
        `${config.apiURL}/groups`,
        axiosConfig
      );

      let data = response.data.data;

      dispatch({ type: actionTypes.GET_ALL_USER_GROUPS_SUCCES, payload: data });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong';
      dispatch({
        type: actionTypes.GET_ALL_USER_GROUPS_SUCCES,
        payload: message,
      });
    }
  }, []);

  const setGroupsDataError = (message: string) => {
    dispatch({ type: actionTypes.GET_ALL_USER_GROUPS_FAIL, payload: message });
  };

  return (
    <GroupsContext.Provider
      value={{
        groupsData: state.groupsData,
        groupsDataLoading: state.groupsDataLoading,
        groupsDataError: state.groupsDataError,
        getUserGroupsData,
        setGroupsDataError,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export default GroupsState;
