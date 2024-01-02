import { LIST_MEETINGS, GET_MEETING, SCHEDULE_MEETING } from './constants';
import * as api from '../api/index.js';

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