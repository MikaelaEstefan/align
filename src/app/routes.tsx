import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import SignIn from "../pages/SignIn";
import Rooms from "../pages/Rooms";
import CreateRoom from "../pages/CreateRoom";
import JoinRoom from "../pages/JoinRoom";
import Waiting from "../pages/Waiting";
import Swipe from "../pages/Swipe";
import Results from "../pages/Results";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/create" element={<CreateRoom />} />
      <Route path="/rooms/join" element={<JoinRoom />} />
      <Route path="/rooms/:code/waiting" element={<Waiting />} />
      <Route path="/rooms/:code/swipe" element={<Swipe />} />
      <Route path="/rooms/:code/results" element={<Results />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}