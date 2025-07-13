import { LuCloudUpload } from "react-icons/lu";

function UploadFile() {
  return (
    <div className="main-section" id="upload-file">
      <button className="upload-btn">
        <LuCloudUpload className="recording-btn__icon" />
      </button>
      <p className="main-section__text">
        برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید
      </p>
      <p className="main-section__text">
        متن پیاده شده آن، در اینجا ظاهر می شود
      </p>
    </div>
  );
}

export default UploadFile;
