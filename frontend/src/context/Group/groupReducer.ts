import * as actionTypes from './groupTypes';

export const groupReducer = (state: any, action: any) => {
  switch (action.type) {
    // GET Group Data
    case actionTypes.GET_GROUPDATA_LOADING:
      return {
        ...state,
      };
    case actionTypes.GET_GROUPDATA_SUCCESS:
      return {
        ...state,
        groupData: action.payload,
      };
    case actionTypes.GET_GROUPDATA_FAIL:
      return {
        ...state,
      };

    // CLEAR GROUP DATA
    case actionTypes.CLEAR_GROUP_DATA:
      return {
        ...state,
        groupData: null,
        groupDataLoading: false,
        groupDataError: '',
        albumData: [],
        albumDataLoading: false,
        albumDataError: '',
      };
    default:
      return state;
  }
};
