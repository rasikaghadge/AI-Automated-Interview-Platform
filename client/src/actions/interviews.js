/* eslint-disable no-unused-vars */
import { GET_INTERVIEWS, START_LOADING, LIST_MEETINGS, GET_MEETING, SCHEDULE_MEETING, UPDATE_MEETING } from './constants.js';
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

export const changeMeetingStatus = (id, status) => async (dispatch) => {
  try {
    const statusJson = { status: status };
    const {data} = await api.changeMeetingStatus(id, statusJson);
    dispatch({ type: UPDATE_MEETING, payload: data });
  } catch (error) {
    console.log(error);
  }
}