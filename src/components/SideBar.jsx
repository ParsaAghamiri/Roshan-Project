import { NavLink } from "react-router-dom";

function SideBar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img
          src="/Assets/icons/logo-icon.svg"
          alt="logo"
          className="logo__icon"
          width="32"
          height="32"
        />
        <span className="logo__text">آوا</span>
      </div>
      <div className="sidebar-navigate">
        <NavLink to="/speech" className="navigate-btn">
          <img
            src="/Assets/icons/speech icon.svg"
            alt="speech"
            className="navigate-btn__icon"
            width="22"
            height="25"
          />
          <span className="navigate-btn__text">تبدیل گفتار</span>
        </NavLink>
        <NavLink to="/archive" className="navigate-btn archive">
          <img
            src="/Assets/icons/archive Icon.svg"
            alt="speech"
            className="navigate-btn__icon"
            width="22"
            height="25"
          />
          <span className="navigate-btn__text">آرشیو</span>
        </NavLink>
      </div>
    </div>
  );
}

export default SideBar;
