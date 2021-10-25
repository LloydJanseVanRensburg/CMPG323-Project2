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
      };
    case actionTypes.GET_GROUPDATA_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};
