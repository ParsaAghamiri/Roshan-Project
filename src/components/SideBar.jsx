import { BsSoundwave } from "react-icons/bs";
import { PiMicrophone } from "react-icons/pi";
import { FaRegFolder } from "react-icons/fa";

function SideBar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <BsSoundwave className="logo__icon" />
        <span className="logo__text">آوا</span>
      </div>
      <div className="sidebar-navigate">
        <button className="navigate-btn active">
          <PiMicrophone className="navigate-btn__icon" />
          <span className="navigate-btn__text">تبدیل گفتار</span>
        </button>
        <button className="navigate-btn archive">
          <FaRegFolder className="navigate-btn__icon" />
          <span className="navigate-btn__text">آرشیو</span>
        </button>
      </div>
    </div>
  );
}

export default SideBar;
