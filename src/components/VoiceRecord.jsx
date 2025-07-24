import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { PiMicrophone, PiStop } from "react-icons/pi";
import { FiLoader } from "react-icons/fi";
import { transcribeAudioFile } from "../services/api";
import Response from "./Response";

function VoiceRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState(null);

  const mediaRecorderRef = useRef(null);

  const handleToggleRecording = async () => {
    setError(null);
    setTranscript(null);

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
        setIsProcessing(true);
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
          setTranscript(response.data[0]);
          toast.success("فایل با موفقیت پیاده‌سازی شد!");
        } catch (err) {
          console.error("Error uploading file:", err);
          toast.error("بارگذاری فایل با خطا مواجه شد.");
        } finally {
          setIsProcessing(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("دسترسی به میکروفون امکان‌پذیر نیست.");
      setIsRecording(false);
    }
  };

  const handleStartOver = () => {
    setTranscript(null);
  };

  return (
    <div className="main-section">
      {transcript ? (
        <div className="response-wrapper">
          <Response
            type={"voice"}
            result={transcript}
            onStartOver={handleStartOver}
          />
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
