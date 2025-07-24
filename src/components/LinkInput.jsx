import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLink, FiLoader } from "react-icons/fi";

function LinkInput() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { handleAddItemToArchive } = useOutletContext();

  const handleSubmit = () => {
    if (!url || !url.startsWith("http")) {
      toast.error("لطفا یک آدرس معتبر وارد کنید.");
      return;
    }

    setIsProcessing(true);

    const audio = new Audio(url);

    audio.onloadedmetadata = () => {
      const fileExtension = `.${url.split(".").pop()}`.split("?")[0];

      handleAddItemToArchive({
        source_type: "LINK",
        file_name: url,
        file_type: fileExtension || ".link",
        duration: audio.duration,
      });

      toast.success("لینک با موفقیت به آرشیو اضافه شد!");

      setIsProcessing(false);
      setUrl("");
    };

    audio.onerror = () => {
      toast.error("فایل در این نشانی یافت نشد.");
      setIsProcessing(false);
    };
  };

  return (
    <div className="main-section" id="link-input">
      <div className="link-input-container">
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="link-input-btn"
        >
          {isProcessing ? <FiLoader /> : <FiLink className="link-btn__icon" />}
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
    </div>
  );
}

export default LinkInput;
