import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useState } from "react";
import { api } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "" });

  async function handleRegister(e) {
    e.preventDefault();
    await api.post("/auth/register", form);
    window.location.href = "/";
  }

  return (
    <div className="flex align-items-center justify-content-center h-screen">
      <form className="glass-card p-5 w-30" onSubmit={handleRegister}>
        <h2 className="mb-4 text-center">Criar Conta</h2>

        <InputText placeholder="Nome" className="w-full mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <InputText placeholder="CPF" className="w-full mb-3"
          onChange={(e) => setForm({ ...form, cpf: e.target.value })} />

        <InputText placeholder="Email" className="w-full mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <Password placeholder="Senha" className="w-full mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <Button label="Registrar" className="w-full p-button-lg" />
      </form>
    </div>
  );
}
