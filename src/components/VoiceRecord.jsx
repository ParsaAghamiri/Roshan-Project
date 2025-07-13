import { PiMicrophone } from "react-icons/pi";

function VoiceRecord() {
  return (
    <div className="main-section">
      <button className="recording-btn">
        <PiMicrophone className="recording-btn__icon" />
      </button>
      <p className="main-section__text">برای شروع به صحبت، دکمه را فشار دهید</p>
      <p className="main-section__text">متن پیاده شده آن، در اینجا ظاهر شود</p>
    </div>
  );
}

export default VoiceRecord;
