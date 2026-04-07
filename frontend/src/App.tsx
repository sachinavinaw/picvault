import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import NotFoundPage from "./components/pages/NotFoundPage";
import ErrorPage from "./components/pages/ErrorPage";
import UploadImagePage from "./features/upload/UploadImagePage";
import GalleryPage from "./features/gallery/GalleryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<UploadImagePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
