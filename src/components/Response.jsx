import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { BsTextRight } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { FiRefreshCw } from "react-icons/fi";

function Response({ result, onStartOver, type }) {
  const [activeTab, setActiveTab] = useState("simple");
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const audioRef = useRef(null);

  const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const secondsToTimeString = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  };

  const formatSegmentTime = (timeStr) => {
    if (!timeStr) return "00:00";
    const seconds = timeToSeconds(timeStr);
    return secondsToTimeString(seconds);
  };

  const findCurrentSegment = (currentTime) => {
    if (!result?.segments) return -1;

    for (let i = 0; i < result.segments.length; i++) {
      const segment = result.segments[i];
      const startTime = timeToSeconds(segment.start);
      const endTime = timeToSeconds(segment.end);

      if (currentTime >= startTime && currentTime <= endTime) {
        return i;
      }
    }
    return -1;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const segmentIndex = findCurrentSegment(currentTime);
      setCurrentSegmentIndex(segmentIndex);
    };

    const handleEnded = () => {
      setCurrentSegmentIndex(-1);
    };

    const handlePause = () => {};

    const handlePlay = () => {
      const currentTime = audio.currentTime;
      const segmentIndex = findCurrentSegment(currentTime);
      setCurrentSegmentIndex(segmentIndex);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [result]);

  const handleSegmentClick = (segment, index) => {
    if (audioRef.current && segment.start) {
      const startTime = timeToSeconds(segment.start);
      audioRef.current.currentTime = startTime;
      setCurrentSegmentIndex(index);

      if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleCopy = () => {
    if (result && result.segments) {
      const fullText = result.segments.map((segment) => segment.text).join(" ");
      navigator.clipboard.writeText(fullText);
      toast.success("متن کپی شد!");
    }
  };

  const handleDownload = () => {
    if (result && result.segments) {
      let content = "";

      if (activeTab === "simple") {
        content = result.segments.map((segment) => segment.text).join(" ");
      } else {
        content = result.segments
          .map(
            (segment) =>
              `${formatSegmentTime(segment.start)} - ${formatSegmentTime(
                segment.end
              )}: ${segment.text}`
          )
          .join("\n");
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transcript_${activeTab}_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("فایل دانلود شد!");
    } else {
      toast.error("متنی برای دانلود وجود ندارد!");
    }
  };

  const getAudioUrl = () => {
    if (result?.media_url) {
      return result.media_url;
    }
    if (result?.url) {
      return result.url;
    }
    if (result?.audio_url) {
      return result.audio_url;
    }
    if (result?.file_url) {
      return result.file_url;
    }
    if (result?.audioUrl) {
      return result.audioUrl;
    }
    if (result?.fileUrl) {
      return result.fileUrl;
    }
    if (result?.source_url) {
      return result.source_url;
    }

    return null;
  };

  const audioUrl = getAudioUrl();

  return (
    <div className="response-wrapper">
      <div className="response-header">
        <div className="response-types">
          <div
            className={`response-text ${
              activeTab === "simple" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("simple")}
          >
            <BsTextRight />
            <span>متن ساده</span>
          </div>
          <div
            className={`response-timing ${
              activeTab === "timed" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("timed")}
          >
            <BiTimeFive />
            <span>متن زمان‌بندی شده</span>
          </div>
        </div>
        <div className="response-options">
          <BsDownload onClick={handleDownload} className="download-icon" />
          <RxCopy onClick={handleCopy} className="copy-icon" />
          <button
            className={`refresh-btn ${
              type === "link" ? "red" : type === "upload" ? "blue" : "green"
            }`}
            onClick={onStartOver}
          >
            <FiRefreshCw />
            <span>شروع دوباره</span>
          </button>
        </div>
      </div>

      {activeTab === "simple" && (
        <>
          <div className="response-content-scrollable">
            {result && result.segments ? (
              <div
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  lineHeight: "1.6",
                }}
              >
                {result.segments.map((segment, index) => (
                  <span
                    key={index}
                    className={
                      currentSegmentIndex === index ? "highlighted-text" : ""
                    }
                    onClick={() => handleSegmentClick(segment, index)}
                    style={{
                      cursor: audioUrl ? "pointer" : "default",
                      color: currentSegmentIndex === index ? "#118AD3" : "",
                      transition: "background-color 0.3s ease",
                      display: "inline",
                    }}
                  >
                    {segment.text}{" "}
                  </span>
                ))}
              </div>
            ) : (
              <p>No text detected.</p>
            )}
          </div>
          {audioUrl && (
            <div className="voice-preview-container">
              <audio ref={audioRef} controls className="voice-preview-player">
                <source src={audioUrl} type="audio/mpeg" />
                <source src={audioUrl} type="audio/wav" />
                <source src={audioUrl} type="audio/ogg" />
                مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
              </audio>
            </div>
          )}
        </>
      )}

      {activeTab === "timed" && (
        <>
          <div className="response-content-scrollable">
            {result && result.segments ? (
              result.segments.map((segment, index) => (
                <div
                  key={segment.id || index}
                  className={`timed-text-row ${
                    index % 2 === 0 ? "row-gray" : "row-white"
                  } ${currentSegmentIndex === index ? "highlighted-row" : ""}`}
                  onClick={() => handleSegmentClick(segment, index)}
                  style={{
                    cursor: audioUrl ? "pointer" : "default",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="time-stamps">
                    <span
                      className="time-stamp"
                      style={{
                        color: currentSegmentIndex === index ? "#118AD3" : "",
                      }}
                    >
                      {formatSegmentTime(segment.start)}
                    </span>
                    <span
                      className="time-stamp"
                      style={{
                        color: currentSegmentIndex === index ? "#118AD3" : "",
                      }}
                    >
                      {formatSegmentTime(segment.end)}
                    </span>
                  </div>
                  <p
                    className="segment-text"
                    style={{
                      color: currentSegmentIndex === index ? "#118AD3" : "",
                    }}
                  >
                    {segment.text}
                  </p>
                </div>
              ))
            ) : (
              <p>No timed text available.</p>
            )}
          </div>
          {audioUrl && (
            <div className="voice-preview-container">
              <audio ref={audioRef} controls className="voice-preview-player">
                <source src={audioUrl} type="audio/mpeg" />
                <source src={audioUrl} type="audio/wav" />
                <source src={audioUrl} type="audio/ogg" />
                مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
              </audio>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Response;
