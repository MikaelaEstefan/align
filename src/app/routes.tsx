import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import SignIn from "../pages/SignIn";
import Rooms from "../pages/Rooms";
import CreateRoom from "../pages/CreateRoom";
import JoinRoom from "../pages/JoinRoom";
import Waiting from "../pages/Waiting";
import Swipe from "../pages/Swipe";
import Results from "../pages/Results";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/create"
        element={
          <ProtectedRoute>
            <CreateRoom />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/join"
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/:code/waiting"
        element={
          <ProtectedRoute>
            <Waiting />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/:code/swipe"
        element={
          <ProtectedRoute>
            <Swipe />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms/:code/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}