// Core React
import { useReducer } from 'react';

// AlbumContext
import { AlbumContext } from './albumContext';

// AlbumReducer
import { albumReducer } from './albumReducer';

// Album Action Types
import * as actionTypes from './albumTypes';

// Axios & Module
import axios from 'axios';
import { config } from '../../constants/config';

const AlbumState: React.FC = ({ children }) => {
  const albumInitialReducerState = {
    currentAlbum: null,
    albumDataLoading: false,
    albumDataError: '',

    // Load album posts
    albumPosts: [],
    postsDataLoading: false,
    postsDataError: '',
  };

  const [state, dispatch] = useReducer(albumReducer, albumInitialReducerState);

  const getAlbumData = async (albumId: string) => {
    try {
      dispatch({ type: actionTypes.GET_ALBUMDATA_LOADING });

      let token = localStorage.getItem('authToken');

      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: any = await axios.get(
        `${config.apiURL}/albums/${albumId}`,
        axiosConfig
      );

      let data = response.data?.data;

      dispatch({ type: actionTypes.GET_ALBUMDATA_SUCCESS, payload: data });
    } catch (error: any) {
      let message = error.respose
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.GET_ALBUMDATA_SUCCESS, payload: message });
    }
  };

  const getAlbumPostData = async (albumId: string) => {
    try {
      let token = localStorage.getItem('authToken');
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      dispatch({ type: actionTypes.GET_ALBUM_POSTS_LOADING });

      const response: any = await axios.post(
        `${config.apiURL}/posts/album-posts`,
        { albumId: albumId },
        axiosConfig
      );

      let posts = response.data.data;

      dispatch({ type: actionTypes.GET_ALBUM_POSTS_SUCCESS, payload: posts });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      dispatch({ type: actionTypes.GET_ALBUM_POSTS_FAIL, payload: message });
    }
  };

  const clearAlbumData = () => {
    dispatch({ type: actionTypes.CLEAR_ALBUM_DATA });
  };

  const searchPostsHandler = (e: any) => {
    dispatch({ type: actionTypes.SEARCH_POSTS, payload: e.detail.value });
  };

  const createNewPost = async (postData: any) => {
    try {
      dispatch({ type: actionTypes.ADD_NEW_POST_LOADING });

      const token = localStorage.getItem('authToken');

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: any = await axios.post(
        `${config.apiURL}/posts`,
        postData,
        axiosConfig
      );

      const data = response.data.data;

      dispatch({ type: actionTypes.ADD_NEW_POST_SUCCESS, payload: data });
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';

      dispatch({ type: actionTypes.ADD_NEW_POST_FAIL, payload: message });
    }
  };

  return (
    <AlbumContext.Provider
      value={{
        currentAlbum: state.currentAlbum,
        albumDataLoading: state.albumDataLoading,
        albumDataError: state.albumDataError,
        albumPosts: state.albumPosts,
        postsDataLoading: state.postsDataLoading,
        postsDataError: state.postsDataError,
        getAlbumData,
        getAlbumPostData,
        clearAlbumData,
        searchPostsHandler,
        createNewPost,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export default AlbumState;
