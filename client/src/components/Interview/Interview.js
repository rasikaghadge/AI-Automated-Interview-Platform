import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import styles from "./Interview.module.css";
import { useLocation } from "react-router-dom";
import { questions, introduction } from "./FirstQuestions";
import { processCandidateAnswer } from "../../actions/modelCommunication";
import { useDispatch } from "react-redux";

const Interview = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const candidateName = location?.state?.participantNameFromDB;
  const endTime = location?.state?.endTimeFromDB;
  const interviewDate = location?.state?.startDateFromDB;
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioStream, setAudioStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const mimeType = "audio/wav";
  const liveVideoFeed = useRef(null);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    getMicrophonePermission();
    getCameraPermission();

    const interviewEndTime = new Date(interviewDate);
    interviewEndTime.setHours(
      interviewEndTime.getHours() + parseInt(endTime.split(":")[0] - 5)
    );
    interviewEndTime.setMinutes(parseInt(endTime.split(":")[1]));

    const intervalId = setInterval(() => {
      const now = new Date();
      const difference = interviewEndTime - now;

      if (difference <= 0) {
        setRemainingTime(0);
        clearInterval(intervalId);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setRemainingTime(
          `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  useEffect(() => {
    const startInterview = async () => {
      await readQuestion(introduction[0]);
      const randomIndex = Math.floor(Math.random() * questions.length);
      await displayAndReadQuestion(questions[randomIndex]);
    };
    startInterview();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setAudioStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const getCameraPermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: false,
          video: true,
        };
        const audioConstraints = { audio: true };
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );
        setPermission(true);
        liveVideoFeed.current.srcObject = videoStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(audioStream, { type: mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const audioBase64 = reader.result.split(",")[1];

        sendAudioAndGetNextQuestion(audioBase64);
      };
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const sendAudioAndGetNextQuestion = async (audioBase64) => {
    // TODO: Test with django server
    let response = await dispatch(processCandidateAnswer(audioBase64));
    // TODO: Change it to the question from response
    let str = generateString(10);
    displayAndReadQuestion(str);
    console.log("Generated string: ", str);
  };

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  function generateString(length) {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const readQuestion = (question) => {
    const speech = new SpeechSynthesisUtterance(question);
    return new Promise((resolve) => {
      if (speechSynthesis.getVoices().length > 0) {
        speech.voice = speechSynthesis.getVoices()[7];
        speechSynthesis.speak(speech);
      }
      window.speechSynthesis.onvoiceschanged = function () {
        speech.voice = speechSynthesis.getVoices()[7];
        speechSynthesis.speak(speech);
        resolve();
      };
    });
  };

  const displayAndReadQuestion = async (question) => {
    document.getElementById("question").innerHTML = question;
    readQuestion(question);
  };

  return (
    <div className={styles["interview-container"]}>
      <div className={styles["header-container"]}>
        <span className={styles["candidate-name"]}>{candidateName}</span>
        {remainingTime !== null && (
          <span className={styles["remaining-time"]}>{remainingTime}</span>
        )}
        <Link to={"/scheduledinterviews"}>
          <button className={styles["end-interview-button"]}>
            End Interview
          </button>
        </Link>
      </div>
      <div className={styles["question-container"]}>
        <p id="question">Question will be shown here</p>
      </div>
      <div className={styles["video-container"]}>
        <video
          ref={liveVideoFeed}
          autoPlay
          className={styles["live-player"]}
        ></video>
      </div>
      <div className={styles["controls-container"]}>
        <button onClick={startRecording}>
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
        <button onClick={stopRecording}>
          <FontAwesomeIcon icon={faMicrophoneSlash} />
        </button>
        {audio ? (
          <div className="audio-container">
            <a download href={audio}>
              Download Recording
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Interview;
