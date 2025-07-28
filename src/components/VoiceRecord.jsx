import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { PiMicrophone, PiStop } from "react-icons/pi";
import { FiLoader } from "react-icons/fi";
import { transcribeAudioFile } from "../services/api";
import {
  setTranscript,
  setProcessing,
  setError,
  setType,
  clearTranscript,
} from "../store/slices/transcriptSlice";
import Response from "./Response";

function VoiceRecord() {
  const dispatch = useDispatch();
  const { transcript, isProcessing, error } = useSelector(
    (state) => state.transcript
  );
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);

  const handleToggleRecording = async () => {
    dispatch(clearTranscript());

    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        dispatch(setProcessing(true));
        dispatch(setType("voice"));
        const audioBlob = new Blob(audioChunks, {
          type: mediaRecorder.mimeType,
        });
        const fileExtension = mediaRecorder.mimeType
          .split("/")[1]
          .split(";")[0];

        const formData = new FormData();
        formData.append("media", audioBlob, `recording.${fileExtension}`);

        try {
          const response = await transcribeAudioFile(formData);
          dispatch(setTranscript(response.data[0]));
          toast.success("فایل با موفقیت پیاده‌سازی شد!");
        } catch (err) {
          console.error("Error uploading file:", err);
          toast.error("بارگذاری فایل با خطا مواجه شد.");
        } finally {
          dispatch(setProcessing(false));
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("دسترسی به میکروفون امکان پذیر نیست!");
      setIsRecording(false);
    }
  };

  const handleStartOver = () => {
    dispatch(clearTranscript());
  };

  return (
    <div className="main-section">
      {transcript ? (
        <div className="response-wrapper">
          <Response onStartOver={handleStartOver} />
        </div>
      ) : (
        <>
          <button
            onClick={handleToggleRecording}
            disabled={isProcessing}
            className={`recording-btn ${isRecording ? "is-recording" : ""}`}
          >
            {isProcessing ? (
              <FiLoader className="recording-btn__icon" />
            ) : isRecording ? (
              <PiStop className="recording-btn__icon" />
            ) : (
              <PiMicrophone className="recording-btn__icon" />
            )}
          </button>

          {isRecording && (
            <p className="main-section__text">در حال ضبط صدا...</p>
          )}
          {isProcessing && (
            <p className="main-section__text">در حال ارسال و پردازش...</p>
          )}

          {!isRecording && !isProcessing && (
            <>
              <p className="main-section__text">
                برای شروع به صحبت، دکمه را فشار دهید
              </p>
              <p className="main-section__text">
                متن پیاده شده آن، در اینجا ظاهر شود
              </p>
            </>
          )}

          {error && (
            <p
              className="main-section__text"
              style={{ color: "red", marginTop: "1rem" }}
            >
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default VoiceRecord;
