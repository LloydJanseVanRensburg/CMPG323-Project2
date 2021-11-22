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

    // Edit group
    editGroupLoading: false,
    editGroupError: '',

    // Album State
    albumData: [],
    searchAlbums: [],
    albumDataLoading: false,
    albumDataError: '',

    // Delete Album
    deleteAlbumLoading: false,
    deleteAlbumError: '',

    // Add Album state
    addAlbumLoading: false,
    addAlbumError: '',
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
      let token = localStorage.getItem('authToken');
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      dispatch({ type: actionTypes.GET_GROUP_ALBUMS_LOADING });

      const response: any = await axios.post(
        `${config.apiURL}/albums/group-albums`,
        { groupId: groupId },
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

  const createNewAlbum = async (data: any) => {
    const AlbumData = data;
    try {
      dispatch({ type: actionTypes.ADD_NEW_ALBUM_LOADING });

      const token = localStorage.getItem('authToken');

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: any = await axios.post(
        `${config.apiURL}/albums`,
        AlbumData,
        axiosConfig
      );

      const data = response.data.data;

      dispatch({ type: actionTypes.ADD_NEW_ALBUM_SUCCESS, payload: data });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';

      dispatch({ type: actionTypes.ADD_NEW_ALBUM_FAIL, payload: message });
    }
  };

  const deleteAlbum = async (albumId: string) => {
    try {
      dispatch({ type: actionTypes.DELETE_ALBUM_LOADING });

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.authToken}`,
        },
      };

      await axios.delete(`${config.apiURL}/albums/${albumId}`, axiosConfig);

      dispatch({ type: actionTypes.DELETE_ALBUM_SUCCESS, payload: albumId });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';

      dispatch({ type: actionTypes.DELETE_ALBUM_FAIL, payload: message });
    }
  };

  const editGroup = async (groupId: string, groupData: any) => {
    try {
      dispatch({ type: actionTypes.EDIT_GROUP_LOADING });

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.authToken}`,
        },
      };

      const result: any = await axios.put(
        `${config.apiURL}/groups/${groupId}`,
        groupData,
        axiosConfig
      );

      const newGroup = result.data.data;

      dispatch({ type: actionTypes.EDIT_GROUP_SUCCESS, payload: newGroup });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';

      dispatch({ type: actionTypes.EDIT_GROUP_FAIL, payload: message });
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groupData: state.groupData,
        groupDataLoading: state.groupDataLoading,
        groupDataError: state.groupDataError,
        searchAlbums: state.searchAlbums,
        albumData: state.albumData,
        albumDataLoading: state.albumDataLoading,
        albumDataError: state.albumDataError,
        addAlbumLoading: state.addAlbumLoading,
        addAlbumError: state.addAlbumError,
        deleteAlbumLoading: state.deleteAlbumLoading,
        deleteAlbumError: state.deleteAlbumError,
        editGroupLoading: state.editGroupLoading,
        editGroupError: state.editGroupError,
        editGroup,
        getGroupData,
        getGroupAlbumData,
        clearGroupData,
        searchAlbumsHandler,
        createNewAlbum,
        deleteAlbum,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupState;
