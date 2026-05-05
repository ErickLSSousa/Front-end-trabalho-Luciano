import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    login(res.data.token);
  }

  return (
    <div className="flex align-items-center justify-content-center h-screen">
      <form className="glass-card p-5 w-25" onSubmit={handleLogin}>
        <h1 className="text-center mb-4">💳 SenaiBank</h1>

        <InputText
          placeholder="Email"
          className="w-full mb-3 p-inputtext-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Password
          placeholder="Senha"
          feedback={false}
          toggleMask
          className="w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button label="Entrar" className="w-full p-button-lg" />
        <p className="text-center mt-3 text-sm">
          Não tem conta? <a href="/register">Criar agora</a>
        </p>
      </form>
    </div>
  );
}