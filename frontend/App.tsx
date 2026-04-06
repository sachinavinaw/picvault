import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import GalleryPage from "./pages/GalleryPage";
import UploadImagePage from "./pages/UploadImagePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<UploadImagePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
