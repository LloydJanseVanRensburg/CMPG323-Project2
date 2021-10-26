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
    searchResults: [],

    // ADD GROUP STATE
    addGroupLoading: false,
    addGroupError: '',

    // DELETE GROUP STATE
    deleteGroupLoading: false,
    deleteGroupError: '',
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

  const searchGroupsHandler = (e: any) => {
    dispatch({ type: actionTypes.SEARCH_GROUPS, payload: e.detail.value });
  };

  const createNewGroup = async (data: any) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('image', data.image);

    try {
      dispatch({ type: actionTypes.ADD_NEW_GROUP_LOADING });

      let token = localStorage.getItem('authToken');
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: any = await axios.post(
        `${config.apiURL}/groups`,
        formData,
        axiosConfig
      );

      let data = response.data.data;
      console.log(data);

      dispatch({ type: actionTypes.ADD_NEW_GROUP_SUCCESS, payload: data });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';

      dispatch({ type: actionTypes.ADD_NEW_GROUP_FAIL, payload: message });
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      dispatch({ type: actionTypes.DELETE_GROUP_LOADING });

      let token = localStorage.getItem('authToken');
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: any = await axios.delete(
        `${config.apiURL}/groups/${groupId}`,
        axiosConfig
      );

      if (response.data.success) {
        dispatch({ type: actionTypes.DELETE_GROUP_SUCCESS, payload: groupId });
      }
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.DELETE_GROUP_FAIL, payload: message });
    }
  };

  return (
    <GroupsContext.Provider
      value={{
        groupsData: state.groupsData,
        groupsDataLoading: state.groupsDataLoading,
        groupsDataError: state.groupsDataError,
        searchResults: state.searchResults,
        addGroupLoading: state.addGroupLoading,
        addGroupError: state.addGroupError,
        deleteGroupLoading: state.deleteGroupLoading,
        deleteGroupError: state.deleteGroupError,
        getUserGroupsData,
        setGroupsDataError,
        searchGroupsHandler,
        createNewGroup,
        deleteGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export default GroupsState;
