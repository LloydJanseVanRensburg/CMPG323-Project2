import { useCallback, useReducer } from 'react';
import * as actionTypes from './groupTypes';
import { GroupContext } from './groupContext';
import { groupReducer } from './groupReducer';
import axios from 'axios';
import { config } from '../../constants/config';

const GroupState: React.FC = ({ children }) => {
  const initialGroupState = {
    groupData: null,
    groupDataLoading: false,
    groupDataError: '',
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

  return (
    <GroupContext.Provider
      value={{
        groupData: state.groupData,
        groupDataLoading: state.groupDataLoading,
        groupDataError: state.groupDataError,
        getGroupData,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupState;
