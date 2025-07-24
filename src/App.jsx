import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Speech from "./pages/Speech";
import Archive from "./pages/Archive";
import VoiceRecord from "./components/VoiceRecord";
import UploadFile from "./components/UploadFile";
import LinkInput from "./components/LinkInput";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/speech" replace />} />
        <Route path="speech" element={<Speech />}>
          <Route index element={<VoiceRecord />} />
          <Route path="upload-file" element={<UploadFile />} />
          <Route path="link" element={<LinkInput />} />
        </Route>
        <Route path="archive" element={<Archive />} />
      </Route>
    </Routes>
  );
}

export default App;
