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
        searchResults: action.payload,
      };
    case actionTypes.GET_ALL_USER_GROUPS_FAIL:
      return {
        ...state,
        groupsDataLoading: false,
        groupsDataError: action.payload,
      };

    // SEARCH USER GROUPS
    case actionTypes.SEARCH_GROUPS:
      let search = state.groupsData.filter((group: any) =>
        group.title.toLowerCase().includes(action.payload.toLowerCase())
      );
      return {
        ...state,
        searchResults: search,
      };

    // CREATING NEW GROUP
    case actionTypes.ADD_NEW_GROUP_LOADING:
      return {
        ...state,
        addGroupLoading: true,
      };
    case actionTypes.ADD_NEW_GROUP_SUCCESS:
      return {
        ...state,
        addGroupLoading: false,
        groupsData: [...state.groupsData, action.payload],
        searchResults: [...state.searchResults, action.payload],
      };
    case actionTypes.ADD_NEW_GROUP_FAIL:
      return {
        ...state,
        addGroupError: action.payload,
        addGroupLoading: false,
      };

    // DELETE GROUP
    case actionTypes.DELETE_GROUP_LOADING:
      return {
        ...state,
        deleteGroupLoading: true,
      };
    case actionTypes.DELETE_GROUP_SUCCESS:
      console.log(state.groupsData);
      return {
        ...state,
        deleteGroupLoading: false,
        groupsData: state.groupsData.filter(
          (group: any) => group.id !== action.payload
        ),
        searchResults: state.searchResults.filter(
          (group: any) => group.id !== action.payload
        ),
      };
    case actionTypes.DELETE_GROUP_FAIL:
      return {
        ...state,
        deleteGroupLoading: false,
        deleteGroupError: action.payload,
      };
    default:
      return state;
  }
};
