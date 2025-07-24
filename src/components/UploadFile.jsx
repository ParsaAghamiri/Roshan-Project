import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { LuCloudUpload } from "react-icons/lu";
import toast from "react-hot-toast";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isReading, setIsReading] = useState(false);

  const { handleAddItemToArchive } = useOutletContext();
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setSelectedFile(file);
    setIsReading(true);

    const mediaElement = document.createElement(
      file.type.startsWith("audio") ? "audio" : "video"
    );
    mediaElement.src = URL.createObjectURL(file);

    mediaElement.onloadedmetadata = () => {
      const fileExtension = "." + file.name.split(".").pop();

      handleAddItemToArchive({
        source_type: "UPLOAD",
        file_name: file.name,
        file_type: fileExtension,
        duration: mediaElement.duration,
      });

      setIsReading(false);
      toast.success("فایل با موفقیت به آرشیو اضافه شد!");
      setSelectedFile(null);
      URL.revokeObjectURL(mediaElement.src);
    };

    mediaElement.onerror = () => {
      setError("فایل انتخاب شده معتبر نیست.");
      setIsReading(false);
      setSelectedFile(null);
    };
  };

  return (
    <div className="main-section" id="upload-file">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="audio/*,video/*"
      />

      <button
        onClick={handleButtonClick}
        disabled={isReading}
        className="upload-btn"
      >
        <LuCloudUpload className="recording-btn__icon" />
      </button>

      {isReading ? (
        <p className="main-section__text">در حال پردازش فایل...</p>
      ) : (
        <>
          <p className="main-section__text">
            برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید
          </p>
          <p className="main-section__text">
            متن پیاده شده آن، در اینجا ظاهر می شود
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

export default UploadFile;
