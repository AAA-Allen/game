import { BrowserRouter, Route, Routes } from "react-router-dom";

import LeaderboardPage from "@/pages/LeaderboardPage";
import LevelPage from "@/pages/LevelPage";
import LoginPage from "@/pages/LoginPage";
import MapPage from "@/pages/MapPage";
import ProfilePage from "@/pages/ProfilePage";
import ResultPage from "@/pages/ResultPage";
import SkillTreePage from "@/pages/SkillTreePage";
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/skill-tree" element={<SkillTreePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
