import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { CiUser } from "react-icons/ci";
import { RiArrowDownSFill } from "react-icons/ri";
import { RxExit } from "react-icons/rx";

function Layout() {
  const [userRole, setUserRole] = useState(false);

  const [archiveItems, setArchiveItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem("archiveItems");
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Failed to parse archive items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("archiveItems", JSON.stringify(archiveItems));
    } catch (error) {
      console.error("Failed to save archive items to localStorage", error);
    }
  }, [archiveItems]);

  const handleAddItemToArchive = (newItem) => {
    const itemWithDetails = {
      ...newItem,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setArchiveItems((prevItems) => [itemWithDetails, ...prevItems]);
  };

  const handleDeleteItem = (itemId) => {
    setArchiveItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

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

      <Outlet
        context={{ archiveItems, handleAddItemToArchive, handleDeleteItem }}
      />
    </div>
  );
}

export default Layout;
