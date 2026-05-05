import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function Routes() {
  const { token } = useAuth();

  if (!token) {
    return <Login />;
  }

  return <Dashboard />;
}