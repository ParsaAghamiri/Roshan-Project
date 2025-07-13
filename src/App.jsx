import { CiUser } from "react-icons/ci";
import "./App.css";
import SideBar from "./components/SideBar";
import { RiArrowDownSFill } from "react-icons/ri";
import Speech from "./pages/Speech";

function App() {
  return (
    <div className="container">
      <div className="user-role">
        <CiUser className="user-icon" />
        <span className="user-role__text">مهمان</span>
        <RiArrowDownSFill className="user-arrow-icon" />
      </div>
      <div className="sidebar-container">
        <SideBar />
      </div>
        <Speech />
    </div>
  );
}

export default App;
