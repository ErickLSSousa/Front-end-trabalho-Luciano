import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex justify-content-between align-items-center p-3 glass-card mb-4">
      <h2>SenaiBank</h2>
      <Button icon="pi pi-sign-out" label="Sair" onClick={handleLogout} />
    </div>
  );
}