import * as api from "../api/index.js";
import { PROCESS_AUDIO } from "./constants";

export const processCandidateAnswer = (audioBase64, technicalSkills, experience, remainingTime, role, strength, weaknesses) => async (dispatch) => {
    try {
      const requestJson = {
        audioBase64: audioBase64,
        technicalSkills: technicalSkills,
        experience: experience,
        remainingTime: remainingTime,
        role: role,
        strengths: strength,
        weaknesses: weaknesses
      };
      const { data } = await api.processCandidateAnswer(requestJson);
      dispatch({ type: PROCESS_AUDIO, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };