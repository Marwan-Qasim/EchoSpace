import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "./store/useAuthStore.js";
import IntroductionPage from "./pages/IntroductionPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return authUser ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return !authUser ? children : <Navigate to="/chat" replace />;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestRoute>
            <IntroductionPage />
          </GuestRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignUpPage />
          </GuestRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
