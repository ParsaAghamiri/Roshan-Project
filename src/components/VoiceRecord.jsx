import { PiMicrophone, PiStop } from "react-icons/pi";
import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

function VoiceRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const { handleAddItemToArchive } = useOutletContext();
  const mediaRecorderRef = useRef(null);

  const handleToggleRecording = async () => {
    setError(null);

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

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: mediaRecorder.mimeType,
        });
        const fileExtension = mediaRecorder.mimeType
          .split("/")[1]
          .split(";")[0];

        handleAddItemToArchive({
          source_type: "RECORD",
          file_name: "Voice Record",
          file_type: `.${fileExtension}`,
          duration: null,
        });

        toast.success('"Voice Record" با موفقیت به آرشیو اضافه شد!');

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

  return (
    <div className="main-section">
      <button
        onClick={handleToggleRecording}
        className={`recording-btn ${isRecording ? "is-recording" : ""}`}
      >
        {isRecording ? (
          <PiStop className="recording-btn__icon" />
        ) : (
          <PiMicrophone className="recording-btn__icon" />
        )}
      </button>

      {isRecording ? (
        <p className="main-section__text">در حال ضبط صدا...</p>
      ) : (
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
    </div>
  );
}

export default VoiceRecord;
