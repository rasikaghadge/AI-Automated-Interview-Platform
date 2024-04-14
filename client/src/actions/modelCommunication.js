import * as api from "../api/index.js";
import { PROCESS_AUDIO, SAVE_USER } from "./constants";

export const processCandidateAnswer = (audioBase64, technicalSkills, experience, remainingTime, role, strength, weaknesses, interviewId) => async (dispatch) => {
    try {
      const requestJson = {
        audioBase64: audioBase64,
        technicalSkills: technicalSkills,
        experience: experience,
        remainingTime: remainingTime,
        role: role,
        strengths: strength,
        weaknesses: weaknesses,
        interviewId: interviewId
      };
      const { data } = await api.processCandidateAnswer(requestJson);
      dispatch({ type: PROCESS_AUDIO, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  export const saveUserDetails = (skills, experience, role, interviewId, topics, requiredSkills) => async (dispatch) => {
    try {
      const requestJson = {
        skills: skills,
        experience: experience,
        role: role,
        interviewId: interviewId,
        topics: topics,
        requiredSkills: requiredSkills
      };
      const { data } = await api.saveUserDetails(requestJson);
      dispatch({ type: SAVE_USER, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };