import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/useAuthStore";
import { useThemeStore } from "./stores/useThemeStore";
import SignUpSignIn from "./components/SignUpSignIn";
import Dashboard from "./components/Dashboard";
import Loader from "./components/Loader";

function App() {
  const { user, loading, initAuth } = useAuthStore();
  const { theme, initTheme } = useThemeStore();

  useEffect(() => {
    initAuth();
    initTheme();
  }, [initAuth, initTheme]);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster position="top-center" richColors />
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <SignUpSignIn />
            }
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
