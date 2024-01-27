import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import styles from "./Interview.module.css";
import { useLocation } from "react-router-dom";

const Interview = () => {
  const location = useLocation();
  const candidateName = location?.state?.participantNameFromDB;
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioStream, setAudioStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const mimeType = "audio/wav";
  const liveVideoFeed = useRef(null);

  useEffect(() => {
    getMicrophonePermission();
    getCameraPermission();
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

  const startInterviewAndGetFirstQuestion = () => {
    // Make a request to the server to get the first question
  }

  const sendAudioAndGetNextQuestion = (audioBase64) => {
    const url = process.env.AI_APP_API || "http://127.0.0.1:8000" // Replace with your server endpoint
    const apiUrl = url + "/process";
    const requestBody = { audioBase64 };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {        
        startRecording();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      let str = generateString(10);
      displayNextQuestion(str);
      console.log("Generated string: ", str);
  };

  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateString(length) {
      let result = ' ';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  const displayNextQuestion = (question) => {
    document.getElementById("question").innerHTML = question;
  }

  return (
    <div className={styles["interview-container"]}>
      <div className={styles["header-container"]}>
        <span className={styles["candidate-name"]}>{candidateName}</span>
        <Link to={"/scheduledinterviews"}>
          <button className={styles["end-interview-button"]}>
            End Interview
          </button>
        </Link>
      </div>
      <div className={styles["question-container"]}>
        <p id="question">Question text here</p>
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
