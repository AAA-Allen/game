import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import LevelPage from "@/pages/LevelPage";
import MapPage from "@/pages/MapPage";
import ResultPage from "@/pages/ResultPage";
import { RequireAuth } from "@/router/guards";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/map" element={<MapPage />} />
          <Route path="/levels/:id" element={<LevelPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
