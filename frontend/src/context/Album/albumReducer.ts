import { start } from 'repl';
import * as actionTypes from './albumTypes';

export const albumReducer = (state: any, action: any) => {
  switch (action.type) {
    // GET CURRENT ALBUM DATA
    case actionTypes.GET_ALBUMDATA_LOADING:
      return {
        ...state,
        albumDataLoading: true,
      };
    case actionTypes.GET_ALBUMDATA_SUCCESS:
      return {
        ...state,
        albumDataLoading: false,
        currentAlbum: action.payload,
      };
    case actionTypes.GET_ALBUMDATA_FAIL:
      return {
        ...state,
        albumDataLoading: false,
        albumDataError: action.payload,
      };

    // GET ALBUM POSTS
    case actionTypes.GET_ALBUM_POSTS_LOADING:
      return {
        ...state,
        postsDataLoading: true,
      };
    case actionTypes.GET_ALBUM_POSTS_SUCCESS:
      return {
        ...state,
        postsDataLoading: false,
        albumPosts: action.payload,
      };
    case actionTypes.GET_ALBUM_POSTS_FAIL:
      return {
        ...state,
        postsDataLoading: false,
        postsDataError: action.payload,
      };

    // EDIT ALBUM
    case actionTypes.EDIT_ALBUM_LOADING:
      return {
        ...state,
        editAlbumLoading: true,
      };
    case actionTypes.EDIT_ALBUM_SUCCESS:
      return {
        ...state,
        editAlbumLoading: false,
        currentAlbum: action.payload,
      };
    case actionTypes.EDIT_ALBUM_FAIL:
      return {
        ...state,
        editAlbumLoading: false,
        editAlbumError: action.payload,
      };

    // ADD NEW POST
    case actionTypes.ADD_NEW_POST_LOADING:
      return {
        ...state,
        addNewPostLoading: true,
      };
    case actionTypes.ADD_NEW_POST_SUCCESS:
      return {
        ...state,
        addNewPostLoading: false,
        albumPosts: [action.payload, ...state.albumPosts],
      };
    case actionTypes.ADD_NEW_POST_FAIL:
      return {
        ...state,
        addNewPostLoading: false,
        addNewPostError: action.payload,
      };

    // EDIT POST
    case actionTypes.EDIT_POST_LOADING:
      return {
        ...state,
        editPostLoading: true,
      };
    case actionTypes.EDIT_POST_SUCCESS:
      return {
        ...state,
        editPostLoading: false,
        albumPosts: state.albumPosts.map((post: any) => {
          if (post.id === action.payload.id) {
            return action.payload;
          }

          return post;
        }),
      };
    case actionTypes.EDIT_POST_FAIL:
      return {
        ...state,
        editPostLoading: false,
        editPostError: action.payload,
      };

    // DELETE POST
    case actionTypes.DELETE_POST_LOADING:
      return {
        ...state,
        deletePostLoading: true,
      };
    case actionTypes.DELETE_POST_SUCCESS:
      return {
        ...state,
        deletePostLoading: false,
        albumPosts: state.albumPosts.filter(
          (post: any) => post.id !== action.payload
        ),
      };
    case actionTypes.DELETE_POST_FAIL:
      return {
        ...state,
        deletePostLoading: false,
        deletePostError: action.payload,
      };

    case actionTypes.CLEAR_ALBUM_DATA:
      return {
        ...state,
        currentAlbum: null,
        albumDataLoading: false,
        albumDataError: '',
        albumPosts: [],
        postsDataLoading: false,
        postsDataError: '',
      };

    default:
      return state;
  }
};
