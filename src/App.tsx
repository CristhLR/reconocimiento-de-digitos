import { Routes, Route } from "react-router-dom";
import Layout from "./Components/ImageForm/Layout";
import ImageForm from "./Components/ImageForm/ImageForm";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ImageForm />} />
        <Route path="/image" element={<ImageForm />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<ImageForm />} />
      </Route>
    </Routes>
  );
}
