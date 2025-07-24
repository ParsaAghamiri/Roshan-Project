import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { CiUser } from "react-icons/ci";
import { RiArrowDownSFill } from "react-icons/ri";
import { RxExit } from "react-icons/rx";

function Layout() {
  const [userRole, setUserRole] = useState(false);

  function handleUserRole() {
    setUserRole(!userRole);
  }

  return (
    <div className="container">
      <div
        onClick={handleUserRole}
        className={`user-dropdown ${userRole ? "drop" : ""}`}
      >
        <div className="user-role">
          <CiUser className="user-icon" />
          <span className="user-role__text">مهمان</span>
          <RiArrowDownSFill
            className={`user-arrow-icon ${userRole ? "arrow-rotate" : ""}`}
          />
        </div>
        <div
          className={`dropdown-content ${
            userRole ? "dropdown-open" : "dropdown-closed"
          }`}
        >
          <span className="seperator"></span>
          <div className="user-exit">
            <RxExit className="user-icon" />
            <span className="user-role__text">خروج</span>
          </div>
        </div>
      </div>
      <div className="sidebar-container">
        <SideBar />
      </div>
      <Outlet />
    </div>
  );
}

export default Layout;
