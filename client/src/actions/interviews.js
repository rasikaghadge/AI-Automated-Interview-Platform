import { GET_INTERVIEWS, START_LOADING } from './constants';
import * as api from '../api/index.js';

export const getInterviewsCandidate = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING })
    const { data } = await api.getInterviewsCandidate(id);
    return data;
  } catch (error) {
    console.log(error.response);
    return error;
  }
};

export const getInterviewsHR = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING })
    const { data } = await api.getInterviewsHR(id);

    return data;
  } catch (error) {
    console.log(error.response);
    return error;
  }
};
