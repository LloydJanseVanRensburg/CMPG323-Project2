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
