import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Interview.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { questions, introduction } from "./FirstQuestions";
import { processCandidateAnswer } from "../../actions/modelCommunication";
import { useDispatch } from "react-redux";
import image from "./interview_img.jpg";
import { changeMeetingStatus } from "../../actions/interviews";
import { decode } from "jsonwebtoken";
import { getProfile } from "../../actions/profile";
import { getMeeting } from "../../actions/interviews";
import FullScreenModal from "./FullScreenModal/FullScreenModal";

const Interview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioStream, setAudioStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const mimeType = "audio/wav";
  const liveVideoFeed = useRef(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const user = JSON.parse(localStorage.getItem("profile"));
  const [candidateData, setCandidateData] = useState({});
  const [interviewData, setInterviewData] = useState({});
  const [candidateName, setCandidateName] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [disqualificationTimer, setDisqualificationTimer] = useState(null);

  useEffect(() => {
    if (!showModal) {
      enterFullscreen();
    }
  }, [showModal]);

  const handleOkClick = () => {
    setShowModal(false);
  };

  const getCandidateId = () => {
    try {
      const decodedToken = decode(user.token);
      return decodedToken.id;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const getCandidateDataFromDB = async (candidateId) => {
    try {
      let response = null;

      response = await dispatch(getProfile(candidateId));

      if (response) {
        setCandidateName(response.user.firstName + " " + response.user.lastName);
        setCandidateData({
          technicalSkills: response.technicalSkills,
          experience: response.experience,
          strengths: response.strengths,
          weaknesses: response.weaknesses
        });
      }
    } catch (error) {
      console.error("Error getting candidate profile: ", error.message);
    }
  };

  const getInterviewDataFromDB = async (id) => {
    try {
      let response = null;
      response = await dispatch(getMeeting(id));

      if (response) {
        setInterviewData({
          role: response.title,
          startDate: response.startDate,
          endTime: response.endTime,
        });
      }
    } catch (error) {
      console.error("Error getting interview data: ", error.message);
    }
  };

  useEffect(async () => {
    if (!user) {
      navigate("/login");
    }

    let candidateId = null;

    if (user) {
      candidateId = getCandidateId();
    }

    if (candidateId) {
      await getCandidateDataFromDB(candidateId);
      await getInterviewDataFromDB(id);
      // for dev purpose
      // await changeInterviewStatus("Live");
    }
  }, []);

  useEffect(() => {
    getMicrophonePermission();
    getCameraPermission();

    if (Object.keys(interviewData).length > 0) {
      const interviewEndTime = new Date(interviewData.startDate);
      const endTime = interviewData.endTime;
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

          alert("Interview has ended!");
          changeInterviewStatus("Completed");
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
    }
  }, [interviewData]);

  useEffect(() => {
    const startInterview = async () => {
      await readQuestion(introduction[0]);
      const randomIndex = Math.floor(Math.random() * questions.length);
      await displayAndReadQuestion(questions[randomIndex]);
    };
    if (showModal === false) {
      startInterview();
    }
  }, [showModal]);

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const handleReEnterFullscreen = () => {
    enterFullscreen();
    clearTimeout(disqualificationTimer); // Clear the disqualification timer
  };

  useEffect(() => {
    const exitFullscreenHandler = () => {
      if (!document.fullscreenElement) {
        clearTimeout(disqualificationTimer);

        const confirmed = window.confirm(
          "Do you want to exit fullscreen mode?"
        );
        if (confirmed) {
          const timer = setTimeout(() => {
            alert(
              "You have been disqualified for exiting the fullscreen mode for more than 2 minutes. Please contact the respective authority for further assistance."
            );
            changeInterviewStatus("Cancelled");
            navigate("/scheduledinterviews");
          }, 120000);
          setDisqualificationTimer(timer);
        } else {
          enterFullscreen();
        }
      }
    };

    document.addEventListener("fullscreenchange", exitFullscreenHandler);
    return () => {
      document.removeEventListener("fullscreenchange", exitFullscreenHandler);
    };
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
    clearInterval(intervalId);
    setIntervalId(null);
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

  const endInterview = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end the interview?"
    );

    if (confirmed) {
      changeInterviewStatus("Completed");
      navigate("/scheduledinterviews");
    }
  };

  const changeInterviewStatus = async (status) => {
    try {
      await dispatch(changeMeetingStatus(id, status));
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  const sendAudioAndGetNextQuestion = async (audioBase64) => {
    let response = await dispatch(
      processCandidateAnswer(
        audioBase64,
        candidateData.technicalSkills,
        candidateData.experience,
        remainingTime,
        interviewData.role,
        candidateData.strengths,
        candidateData.weaknesses,
        id
      )
    );
    displayAndReadQuestion(response["openai-response"]);
  };

  /** 
   * For testing purpose
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
  */

  const readQuestion = (question) => {
    const speech = new SpeechSynthesisUtterance(question);
    if (question !== introduction[0]) {
      speech.onend = function (event) {
        document.getElementById("startRecordingBtn").click();
        showTimerToAnswerQuestion();
      };
    }

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

  const showTimerToAnswerQuestion = () => {
    const timerElement = document.getElementById("timer");
    const extendTimerButton = document.getElementById("extendTimerButton");
    timerElement.classList.add(styles["answer-time"]);
    let timeLeft = 60;
    let tempId;
    let isTimeExtended = false;
    const updateTimer = () => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      timerElement.textContent = formattedTime;

      timeLeft--;
      if (isTimeExtended) {
        timeLeft += 60;
        extendTimerButton.disabled = true;
        isTimeExtended = false;
      } else if (timeLeft < 0) {
        timerElement.textContent = "Time's up!";
        setTimeout(() => {
          timerElement.textContent = "";
          timerElement.classList.remove(styles["answer-time"]);
        }, 2000);
        document.getElementById("stopRecordingBtn").click();
        clearInterval(tempId);
      }
    };
    updateTimer();
    tempId = setInterval(updateTimer, 1000);
    setIntervalId(tempId);
    extendTimerButton.disabled = false;
    extendTimerButton.addEventListener("click", () => {
      isTimeExtended = true;
    });
  };

  return (
    <idv>
      {showModal && (
        <FullScreenModal onOk={handleOkClick}>
          <p>You are about to enter fullscreen mode.</p>
          <p>Click "OK" to continue.</p>
        </FullScreenModal>
      )}
      <div className={styles["interview-container"]}>
        <div className={styles["video-container"]}>
          <video
            ref={liveVideoFeed}
            autoPlay
            className={styles["live-player"]}
          ></video>
        </div>
        <div className={styles["header-container"]}>
          {Object.keys(candidateData).length > 0 && (
            <span className={styles["candidate-name"]}>{candidateName}</span>
          )}
          {remainingTime !== null && (
            <span className={styles["remaining-time"]}>{remainingTime}</span>
          )}
          <button
            className={styles["end-interview-button"]}
            onClick={endInterview}
          >
            End Interview
          </button>
        </div>
        <div className={styles["image"]}>
          <img src={image} alt="Image" />
        </div>
        <div className={styles["question-container"]}>
          <p id="question">Question will be shown here</p>
        </div>

        <div className={styles["controls-container"]}>
          {recordingStatus === "inactive" ? (
            <button disabled>
              <FontAwesomeIcon icon={faMicrophoneSlash} />
            </button>
          ) : (
            <button onClick={stopRecording} id="stopRecordingBtn">
              <FontAwesomeIcon icon={faMicrophone} />
            </button>
          )}

          <div className={styles["tooltip"]}>
            <button
              className={styles["extend-timer-button"]}
              id="extendTimerButton"
            >
              +60
            </button>
            <span className={styles["tooltiptext"]}>
              Extend answering time by 60 seconds
            </span>
          </div>
          {document.fullscreenElement ? (
              <button disabled onClick={handleReEnterFullscreen}>
                <FontAwesomeIcon icon={faExpand} />
              </button>
          ) : (
            <div className={styles["tooltip"]}>
              <button onClick={handleReEnterFullscreen}>
                <FontAwesomeIcon icon={faExpand} />
              </button>
              <span className={styles["tooltiptext"]}>Enter Fullscreen</span>
            </div>
          )}
          <button
            style={{ display: "none" }}
            onClick={startRecording}
            id="startRecordingBtn"
          ></button>
          <div>
            <p id="timer"></p>
          </div>
          {/*
         Below code is commented out as it may be required in future
         {audio ? (
          <div className="audio-container">
            <a download href={audio}>
              Download Recording
            </a>
          </div>
        ) : null} */}
        </div>
      </div>
    </idv>
  );
};

export default Interview;
