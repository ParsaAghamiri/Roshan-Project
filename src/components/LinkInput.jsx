import { FiLink } from "react-icons/fi";

function LinkInput() {
  return (
    <div className="main-section" id="link-input">
      <div className="link-input-container">
        <button className="link-input-btn">
          <FiLink className="link-btn__icon" />
        </button>
        <input type="text" placeholder="https://www.example.com" />
      </div>
      <p className="main-section__text">
        نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد{" "}
      </p>
      <p className="main-section__text">و دکمه را فشار دهید</p>
    </div>
  );
}

export default LinkInput;
