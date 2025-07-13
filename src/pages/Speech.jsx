import { PiMicrophone } from "react-icons/pi";
import { LuCloudUpload } from "react-icons/lu";
import { FiLink } from "react-icons/fi";
import { RiArrowDownSFill } from "react-icons/ri";
import { useState } from "react";

function Speech() {
  const [activeSection, setActiveSection] = useState("voice-record");

  return (
    <>
      <div className="content-container">
        <div className="transform-title">
          <h1 className="transform-title__header">تبدیل گفتار به متن</h1>
          <p className="transform-title__text">
            آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف، <br />
            زبان فارسی را یاد گرفته است و می‌تواند متن صحبت‌ها را بنویسد.
          </p>
        </div>
        <div className="navigation-section">
          <ul className="navigation-options">
            <li
              onClick={() => setActiveSection("voice-record")}
              className={`navigation-link ${
                activeSection === "voice-record" ? "voice-record" : ""
              }`}
            >
              <PiMicrophone className="navigate-btn__icon" />
              <span className="navigation-link__text">ضبط صدا</span>
            </li>
            <li
              onClick={() => setActiveSection("upload-file")}
              className={`navigation-link ${
                activeSection === "upload-file" ? "upload-file" : ""
              }`}
            >
              <LuCloudUpload className="navigate-btn__icon" />
              <span className="navigation-link__text">بارگذاری فایل</span>
            </li>
            <li
              onClick={() => setActiveSection("link")}
              className={`navigation-link ${
                activeSection === "link" ? "link" : ""
              }`}
            >
              <FiLink className="navigate-btn__icon" />
              <span className="navigation-link__text">لینک</span>
            </li>
          </ul>
          <div className="content-section">
            {activeSection === "voice-record" && <div>voice-record section</div>}
            {activeSection === "upload-file" && <div>upload-file section</div>}
            {activeSection === "link" && <div>link-input section</div>}
          </div>
          <div className="select-speech">
            <span className="selection-desc">زبان گفتار:</span>
            <div className="speech-selection">
              <span className="language">فارسی</span>
              <RiArrowDownSFill className="user-arrow-icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Speech;
