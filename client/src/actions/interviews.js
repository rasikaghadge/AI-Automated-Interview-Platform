/* eslint-disable no-unused-vars */
import * as api from '../api/index.js';
import { GET_EVALUATION, GET_MEETING, LIST_MEETINGS, SCHEDULE_MEETING, START_LOADING, UPDATE_MEETING } from './constants.js';

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

export const listMeetings = () => async (dispatch) => {
  try {
    const { data } = await api.listMeetings();
    dispatch({ type: LIST_MEETINGS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getMeeting = (id) => async (dispatch) => {
  try {
    const { data } = await api.getMeeting(id);
    dispatch({ type: GET_MEETING, payload: data });
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const scheduleMeeting = (meetingData) => async (dispatch) => {
  try {
    const { data } = await api.scheduleMeeting(meetingData);
    dispatch({ type: SCHEDULE_MEETING, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const changeMeetingStatus = (id, status, penalty) => async (dispatch) => {
  try {
    const statusJson = { status: status, penalty: penalty };
    const {data} = await api.changeMeetingStatus(id, statusJson);
    dispatch({ type: UPDATE_MEETING, payload: data });
  } catch (error) {
    console.log(error);
  }
}

export const changeInterviewHiringStatus = (id, status) => async (dispatch) => {
  try {
    const statusJson = { hiringStatus: status};
    const {data} = await api.changeInterviewHiringStatus(id, statusJson);
    dispatch({ type: UPDATE_MEETING, payload: data });
  } catch (error) {
    console.log(error);
  }
}

export const getEvaluation = (id) => async (dispatch) => {
  try {
    const { data } = await api.getEvaluation(id);
    dispatch({type: GET_EVALUATION, payload: data });
  } catch (error) {
    console.log(error);
  }
}