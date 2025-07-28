import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FiLink, FiLoader } from "react-icons/fi";
import { transcribeUrl } from "../services/api";
import {
  setTranscript,
  setProcessing,
  setError,
  setType,
  clearTranscript,
} from "../store/slices/transcriptSlice";
import Response from "./Response";

function LinkInput() {
  const dispatch = useDispatch();
  const { transcript, isProcessing } = useSelector((state) => state.transcript);
  const [url, setUrl] = useState("");

  const handleStartOver = () => {
    dispatch(clearTranscript());
  };

  const handleSubmit = async () => {
    if (!url || !url.startsWith("http")) {
      toast.error("لطفا یک نشانی اینترنتی معتبر وارد کنید.");
      return;
    }
    dispatch(setProcessing(true));
    dispatch(setType("link"));
    dispatch(clearTranscript());
    try {
      const response = await transcribeUrl(url);
      dispatch(setTranscript(response.data[0]));
      toast.success("لینک با موفقیت پیاده‌سازی شد!");
      setUrl("");
    } catch {
      toast.error("ارسال لینک با خطا مواجه شد.");
    } finally {
      dispatch(setProcessing(false));
    }
  };

  return (
    <div className="main-section" id="link-input">
      {transcript ? (
        <div className="response-wrapper">
          <Response onStartOver={handleStartOver} uploadType="link" />
        </div>
      ) : (
        <>
          <div className="link-input-container">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="link-input-btn"
            >
              {isProcessing ? (
                <FiLoader />
              ) : (
                <FiLink className="link-btn__icon" />
              )}
            </button>
            <input
              type="text"
              placeholder="https://www.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          {isProcessing ? (
            <p className="main-section__text">در حال پردازش لینک...</p>
          ) : (
            <>
              <p className="main-section__text">
                نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد
              </p>
              <p className="main-section__text">و دکمه را فشار دهید</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default LinkInput;
