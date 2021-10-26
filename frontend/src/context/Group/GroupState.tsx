import { useCallback, useReducer } from 'react';
import * as actionTypes from './groupTypes';
import { GroupContext } from './groupContext';
import { groupReducer } from './groupReducer';
import axios from 'axios';
import { config } from '../../constants/config';

const GroupState: React.FC = ({ children }) => {
  const initialGroupState = {
    // Single Group State
    groupData: null,
    groupDataLoading: false,
    groupDataError: '',

    // Album State
    albumData: [],
    searchAlbums: [],
    albumDataLoading: false,
    albumDataError: '',
  };

  const [state, dispatch] = useReducer(groupReducer, initialGroupState);

  const getGroupData = useCallback(async (groupId: string) => {
    try {
      dispatch({ type: actionTypes.GET_GROUPDATA_LOADING });

      let token = localStorage.getItem('authToken');

      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: any = await axios.get(
        `${config.apiURL}/groups/${groupId}`,
        axiosConfig
      );

      let data = response.data?.data;

      dispatch({ type: actionTypes.GET_GROUPDATA_SUCCESS, payload: data });
    } catch (error: any) {
      let message = error.respose
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.GET_GROUPDATA_SUCCESS, payload: message });
    }
  }, []);

  const getGroupAlbumData = async (groupId: string) => {
    try {
      let token = localStorage.getItem('authData');
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      dispatch({ type: actionTypes.GET_GROUP_ALBUMS_LOADING });

      const response: any = await axios.get(
        `${config.apiURL}/albums/search`,
        axiosConfig
      );

      let albums = response.data.data;

      dispatch({ type: actionTypes.GET_GROUP_ALBUMS_SUCCESS, payload: albums });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.GET_GROUP_ALBUMS_FAIL, payload: message });
    }
  };

  const clearGroupData = () => {
    dispatch({ type: actionTypes.CLEAR_GROUP_DATA });
  };

  const searchAlbumsHandler = (e: any) => {
    dispatch({ type: actionTypes.SEARCH_ALBUMS, payload: e.detail.value });
  };

  return (
    <GroupContext.Provider
      value={{
        groupData: state.groupData,
        groupDataLoading: state.groupDataLoading,
        groupDataError: state.groupDataError,
        searchAlbums: state.searchAlbums,
        getGroupData,
        getGroupAlbumData,
        clearGroupData,
        searchAlbumsHandler,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupState;
