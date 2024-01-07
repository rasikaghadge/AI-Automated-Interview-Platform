import { createCameraVideoTrack } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../components/VideosdkMeeting/MeetingAppContextDef";
import { createMicrophoneAudioTrack } from "@videosdk.live/react-sdk";

const useMediaStream = () => {
  const { selectedWebcam, webCamResolution } = useMeetingAppContext();

  const getVideoTrack = async ({ webcamId, encoderConfig }) => {
    try {
      const track = await createCameraVideoTrack({
        cameraId: webcamId ? webcamId : selectedWebcam.id,
        encoderConfig: encoderConfig ? encoderConfig : webCamResolution,
        optimizationMode: "motion",
        multiStream: false,
      });

      return track;
    } catch (error) {
      return null;
    }
  };

  const getAudioTrack = async () => {
    try {
      let customTrack = await createMicrophoneAudioTrack({
        encoderConfig: "speech_standard",
        noiseConfig: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        },
      });
      console.log('returning audio track')
      console.log(customTrack);
      return customTrack;
    } catch (error) {
      console.log('error in creating audio trakc')
      console.log(error);
      return null;
    }
  };

  return { getVideoTrack, getAudioTrack };
};

export default useMediaStream;
