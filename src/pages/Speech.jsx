import { PiMicrophone } from "react-icons/pi";
import { LuCloudUpload } from "react-icons/lu";
import { FiLink } from "react-icons/fi";
import { RiArrowDownSFill } from "react-icons/ri";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

function Speech() {
  const [selectOpen, setSelectOpen] = useState(false);

  function handleSelectOpen() {
    setSelectOpen(!selectOpen);
  }

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
            <li>
              <NavLink
                to="/speech"
                end
                className={({ isActive }) =>
                  `navigation-link ${isActive ? "voice-record" : ""}`
                }
              >
                <PiMicrophone className="navigate-btn__icon" />
                <span className="navigation-link__text">ضبط صدا</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/speech/upload-file"
                className={({ isActive }) =>
                  `navigation-link ${isActive ? "upload-file" : ""}`
                }
              >
                <LuCloudUpload className="navigate-btn__icon" />
                <span className="navigation-link__text">بارگذاری فایل</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/speech/link"
                className={({ isActive }) =>
                  `navigation-link ${isActive ? "link" : ""}`
                }
              >
                <FiLink className="navigate-btn__icon" />
                <span className="navigation-link__text">لینک</span>
              </NavLink>
            </li>
          </ul>
          <div className="content-section">
            <Outlet />
          </div>
          <div className="select-speech">
            <span className="selection-desc">زبان گفتار:</span>
            <div onClick={handleSelectOpen} className="speech-dropdown">
              <div className="speech-option">
                <span className="user-role__text">فارسی</span>
                <RiArrowDownSFill
                  className={`user-arrow-icon ${
                    selectOpen ? "arrow-rotate" : ""
                  }`}
                />
              </div>
              <div
                className={`dropdown-content ${
                  selectOpen ? "dropdown-open" : "dropdown-closed"
                }`}
              >
                <span className="seperator"></span>
                <div className="speech-option">
                  <span className="user-role__text speech-option__text">
                    انگلیسی
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Speech;
