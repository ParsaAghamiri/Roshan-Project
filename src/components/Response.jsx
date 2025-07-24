import { BsTextRight } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { FiRefreshCw } from "react-icons/fi";

function Response({ result, onStartOver }) {
  return (
    <>
      <div className="response-header">
        <div className="response-types">
          <div className="response-text">
            <BsTextRight />
            <span>متن ساده</span>
          </div>
          <div className="response-timing">
            <BiTimeFive />
            <span>متن زمان‌بندی شده</span>
          </div>
        </div>
        <div className="response-options">
          <BsDownload className="download-icon" />
          <RxCopy className="copy-icon" />
          <button className="refresh-btn" onClick={onStartOver}>
            <FiRefreshCw />
            <span>شروع دوباره</span>
          </button>
        </div>
      </div>
      <p className="response-content">
        [با][---][---] [با] و[---][---] [با][---][---][---][---] کجایی تو [خوش]
        می دیدی من خسته شدم [ما را] [به] این [زودی] چه جوری شد [عشق شدی] به این
        است[---] [آخرش] سی با فکر [و] چقدر [نزار می خوام] که [چشم تو] [و با
        رفت][---][---][---][---][---][---][---][---] سخت [آرام] ولی ازت می
        خوام[---] بر نگردی هر کسی که به [تو] باشه[---] کاشکی تو منو [بردی] [که
        چشمک][---] با[---][---][---][---][---] [ابو][---] [با] و و و و و [او]
      </p>
    </>
  );
}

export default Response;
