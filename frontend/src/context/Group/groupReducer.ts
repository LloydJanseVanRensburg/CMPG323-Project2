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

    // Edit Group
    case actionTypes.EDIT_GROUP_LOADING:
      return {
        ...state,
        editGroupLoading: true,
      };
    case actionTypes.EDIT_GROUP_SUCCESS:
      return {
        ...state,
        editGroupLoading: false,
        groupData: action.payload,
      };
    case actionTypes.EDIT_GROUP_FAIL:
      return {
        ...state,
        editGroupLoading: false,
        editGroupError: action.payload,
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

    // DELETE ALBUM
    case actionTypes.DELETE_ALBUM_LOADING:
      return {
        ...state,
        deleteAlbumLoading: true,
      };
    case actionTypes.DELETE_ALBUM_SUCCESS:
      return {
        ...state,
        deleteAlbumLoading: false,
        albumData: state.albumData.filter(
          (album: any) => album.id !== action.payload
        ),
      };
    case actionTypes.DELETE_ALBUM_FAIL:
      return {
        ...state,
        deleteAlbumLoading: false,
        deleteAlbumError: action.payload,
      };

    // INVITE TO GROUP
    case actionTypes.INVITE_TO_GROUP_LOADING:
      return {
        ...state,
        inviteToGroupLoading: true,
      };
    case actionTypes.INVITE_TO_GROUP_SUCCESS:
      return {
        ...state,
        inviteToGroupLoading: false,
      };
    case actionTypes.INVITE_TO_GROUP_FAIL:
      return {
        ...state,
        inviteToGroupLoading: false,
        inviteToGroupError: action.payload,
      };

    // SEARCH ALBUMS IN GROUP
    case actionTypes.SEARCH_ALBUMS:
      let search = state.albumData.filter((album: any) =>
        album.title.toLowerCase().includes(action.payload.toLowerCase())
      );
      return {
        ...state,
        searchAlbums: search,
      };

    // Default Return State
    default:
      return state;
  }
};
