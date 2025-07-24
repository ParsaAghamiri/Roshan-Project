import { useState } from "react";
import toast from "react-hot-toast";
import { FiLink, FiLoader } from "react-icons/fi";
import Response from "./Response";
import { transcribeUrl } from '../services/api';

function LinkInput() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState(null);

  const handleStartOver = () => {
    setTranscript(null);
  };

  const handleSubmit = async () => {
    if (!url || !url.startsWith("http")) {
      toast.error("لطفا یک نشانی اینترنتی معتبر وارد کنید.");
      return;
    }
    setIsProcessing(true);
    setTranscript(null);
    try {
      const response = await transcribeUrl(url);
      setTranscript(response.data[0]);
      toast.success("لینک با موفقیت پیاده‌سازی شد!");
      setUrl("");
    } catch (err) {
      toast.error("ارسال لینک با خطا مواجه شد.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="main-section" id="link-input">
      {transcript ? (
        <div className="response-wrapper">
          <Response
            type={"link"}
            result={transcript}
            onStartOver={handleStartOver}
          />
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
