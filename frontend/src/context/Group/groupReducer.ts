import * as actionTypes from './groupTypes';

export const groupReducer = (state: any, action: any) => {
  switch (action.type) {
    // GET Group Data
    case actionTypes.GET_GROUPDATA_LOADING:
      return {
        ...state,
        groupDataLoading: true,
      };
    case actionTypes.GET_GROUPDATA_SUCCESS:
      return {
        ...state,
        groupDataLoading: false,
        groupData: action.payload,
      };
    case actionTypes.GET_GROUPDATA_FAIL:
      return {
        ...state,
        groupDataLoading: false,
        groupDataError: action.payload,
      };

    // CLEAR GROUP DATA
    case actionTypes.CLEAR_GROUP_DATA:
      return {
        ...state,
        groupData: null,
        groupDataLoading: false,
        groupDataError: '',
        albumData: [],
        searchAlbums: [],
        albumDataLoading: false,
        albumDataError: '',
      };

    // GET GROUP ALBUM DATA
    case actionTypes.GET_GROUP_ALBUMS_LOADING:
      return {
        ...state,
        albumDataLoading: true,
      };
    case actionTypes.GET_GROUP_ALBUMS_SUCCESS:
      return {
        ...state,
        albumDataLoading: false,
        albumData: action.payload,
        searchAlbums: action.payload,
      };
    case actionTypes.GET_GROUP_ALBUMS_FAIL:
      return {
        ...state,
        albumDataLoading: false,
        albumDataError: action.payload,
      };

    // ADD NEW ALBUM DATA
    case actionTypes.ADD_NEW_ALBUM_LOADING:
      return {
        ...state,
        addAlbumLoading: true,
      };
    case actionTypes.ADD_NEW_ALBUM_SUCCESS:
      return {
        ...state,
        addAlbumLoading: false,
        albumData: [...state.albumData, action.payload],
        searchAlbums: [...state.searchAlbums, action.payload],
      };
    case actionTypes.ADD_NEW_ALBUM_FAIL:
      return {
        ...state,
        addAlbumLoading: false,
        addAlbumError: action.payload,
      };

    // Default Return State
    default:
      return state;
  }
};
