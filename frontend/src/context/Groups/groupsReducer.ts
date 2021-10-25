import * as actionTypes from './groupsTypes';

export const groupsReducer = (state: any, action: any) => {
  switch (action.type) {
    // GET ALL USER GROUPS
    case actionTypes.GET_ALL_USER_GROUPS_LOADING:
      return {
        ...state,
        groupsDataLoading: true,
      };
    case actionTypes.GET_ALL_USER_GROUPS_SUCCES:
      return {
        ...state,
        groupsDataLoading: false,
        groupsData: action.payload,
      };
    case actionTypes.GET_ALL_USER_GROUPS_FAIL:
      return {
        ...state,
        groupsDataLoading: false,
        groupsDataError: action.payload,
      };
    default:
      return state;
  }
};
