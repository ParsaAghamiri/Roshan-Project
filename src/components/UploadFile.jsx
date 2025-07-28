import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { LuCloudUpload } from "react-icons/lu";
import { FiLoader } from "react-icons/fi";
import { transcribeAudioFile } from "../services/api";
import Response from "./Response";

function UploadFile() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    setError(null);
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await transcribeAudioFile(formData);
      setTranscript(response.data[0]);
      toast.success("فایل با موفقیت پیاده‌سازی شد!");
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("بارگذاری فایل با خطا مواجه شد.");
    } finally {
      setIsProcessing(false);
      event.target.value = null;
    }
  };

  const handleStartOver = () => {
    setTranscript(null);
  };

  return (
    <div className="main-section" id="upload-file">
      {transcript ? (
        <div className="response-wrapper">
          <Response
            type={"upload"}
            result={transcript}
            onStartOver={handleStartOver}
          />
        </div>
      ) : (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="audio/*,video/*"
            disabled={isProcessing}
          />
          <button
            onClick={handleButtonClick}
            disabled={isProcessing}
            className="upload-btn"
          >
            {isProcessing ? (
              <FiLoader />
            ) : (
              <LuCloudUpload className="recording-btn__icon" />
            )}
          </button>

          {isProcessing ? (
            <p className="main-section__text">در حال ارسال و پردازش فایل...</p>
          ) : (
            <p className="main-section__text">
              برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید
              <br /> متن پیاده شده آن، در اینجا ظاهر می شود
            </p>
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

export default UploadFile;
