import * as api from "../api/index.js";
import { PROCESS_AUDIO } from "./constants";

export const processCandidateAnswer = (audioBase64) => async (dispatch) => {
    try {
      const audioJson = {
        audioBase64: audioBase64,
      };
      const { data } = await api.processCandidateAnswer(audioJson);
      dispatch({ type: PROCESS_AUDIO, payload: data });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };