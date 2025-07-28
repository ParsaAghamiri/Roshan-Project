import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { LuCloudUpload } from "react-icons/lu";
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

function UploadFile() {
  const dispatch = useDispatch();
  const { transcript, isProcessing, error } = useSelector(
    (state) => state.transcript
  );
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    dispatch(setError(null));
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    dispatch(setProcessing(true));
    dispatch(setType("upload"));

    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await transcribeAudioFile(formData);
      dispatch(setTranscript(response.data[0]));
      toast.success("فایل با موفقیت پیاده‌سازی شد!");
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("بارگذاری فایل با خطا مواجه شد.");
    } finally {
      dispatch(setProcessing(false));
      event.target.value = null;
    }
  };

  const handleStartOver = () => {
    dispatch(clearTranscript());
  };

  return (
    <div className="main-section" id="upload-file">
      {transcript ? (
        <div className="response-wrapper">
          <Response onStartOver={handleStartOver} uploadType="upload" />
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
