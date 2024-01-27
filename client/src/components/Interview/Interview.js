import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import styles from "./Interview.module.css";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SeeScheduledInterviews from '../SeeScheduledInterviews/SeeScheduledInterviews';

const Interview = (props) => {
  console.log(props);

  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  const candidateName = location?.state?.participantNameFromDB;
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioStream, setAudioStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const mimeType = "audio/mp3";
  const liveVideoFeed = useRef(null);

  useEffect(() => {
    getMicrophonePermission();
    getCameraPermission();
    console.log(location.state)
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
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const directToScheduledInterviews = () => {
    setTimeout(() => {
      window.alert('Interview ended. Redirecting to scheduled interviews.');
      window.location.replace('/scheduledinterviews');
    }, 1000);
  };

  const redirectToScheduledInterviews = async () => {
    try {

      if (!id) {
        console.error('Interview id is undefined');
        return;
      }

      const fetchUrl = `/api/interview/${id}/endtime`;
    console.log('Fetch URL:', fetchUrl);

    console.log('Interview id:', id);
      
      // Fetch endTime from the server
      const response = await fetch(`/api/interview/${id}/endtime`);
      const data = await response.json();

      console.log('Fetch response:', response);
    console.log('Fetched data:', data);

      if (response.ok) {
        const endTime = data.endTime;

        if (endTime) {
          const currentTime = new Date();
          const endDateTime = new Date(endTime);

          console.log('Current Time:', currentTime);
        console.log('End Time:', endDateTime);

          if (currentTime > endDateTime) {
            window.alert(`Interview ended. Redirecting to scheduled interviews. End Time: ${endTime}`);
            navigate("/scheduledinterviews");
          } else {
            const remainingTime = endDateTime - currentTime;
            setTimeout(() => {
              window.alert(`Interview ended. Redirecting to scheduled interviews. End Time: ${endTime}`);
              navigate("/scheduledinterviews");
            }, remainingTime);
          }
        } else {
          window.alert("End time not available.");
        }
      } else {
        console.error('Failed to fetch endTime:', data.message);
      }
    } catch (error) {
      console.error('Error fetching endTime:', error);
    }
  };

  useEffect(() => {
    redirectToScheduledInterviews();
  }, []);


  // const redirectToScheduledInterviews = async () => {
  //   try {

  //     const url = `/api/interview/${id}/endtime`;
  //     console.log('Constructed URL:', url);
      
  //     if (id) {
  //     const response = await fetch(`/api/interview/${id}/endtime`);
  //     const data = await response.json();

  //     if (response.ok) {
  //       const endTime = data.endTime;

  //       if (endTime) {
  //         const currentTime = new Date();
  //         const endDateTime = new Date(endTime);

  //         if (currentTime > endDateTime) {
  //           window.alert(`Interview ended. Redirecting to scheduled interviews. End Time: ${endTime}`);
  //           navigate("/scheduledinterviews");
  //         } else {
  //           const remainingTime = endDateTime - currentTime;
  //           setTimeout(() => {
  //             window.alert(`Interview ended. Redirecting to scheduled interviews. End Time: ${endTime}`);
  //             navigate("/scheduledinterviews");
  //           }, remainingTime);
  //         }
  //       } else {
  //         window.alert("End time not available.");
  //       }
  //     } else {
  //       console.error('Failed to fetch endTime:', data.message);
  //     }
  //   } else {
  //     console.error('Interview ID is undefined.');
  //   }
  //   } catch (error) {
  //     console.error('Error fetching endTime:', error);
  //   }
  // };

  // useEffect(() => {
  //   redirectToScheduledInterviews();
  // }, [id]);

  return (
    
    <div className={styles["interview-container"]}>
      <div className={styles["header-container"]}>
        <span className={styles["candidate-name"]}>{candidateName}</span>
        {/* <Link to={"/scheduledinterviews"}> */}
        <button className={styles["end-interview-button"]} onClick={directToScheduledInterviews}>End Interview</button>
        {/* </Link> */}
      </div>
      <div className={styles["question-container"]}>
        <p id="question">Question text here</p>
      </div>
      <div className={styles["video-container"]}>
        <video ref={liveVideoFeed} autoPlay className={styles["live-player"]}></video>
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
