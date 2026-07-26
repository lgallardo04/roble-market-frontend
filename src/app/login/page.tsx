"use client";

import { useState } from "react";
import { useAuth, Role } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, theme, toggleTheme } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, role, name);
    
    if (role === "admin" || role === "manager") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const handleQuickDemo = (demoRole: Role) => {
    if (demoRole === "admin") {
      login("admin@roblemarket.com", "admin", "Super Administrador");
      router.push("/admin");
    } else if (demoRole === "manager") {
      login("encargado@roblemarket.com", "manager", "Encargado de Inventario");
      router.push("/admin");
    } else {
      login("cliente@roblemarket.com", "customer", "Carlos Mendoza");
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col justify-center items-center p-4 transition-colors">
      {/* THEME TOGGLE BUTTON */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full shadow-md hover:scale-105 transition-transform"
          title="Alternar Tema"
        >
          {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-xl border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#7bb03b] text-white rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-lg">
            RM
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">Iniciar Sesión</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Accede a tu cuenta en Roble Market</p>
        </div>

        {/* DEMO ACCESOS RÁPIDOS */}
        <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-700/50 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-center">Acceso Rápido Demo</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo("customer")}
              className="px-2 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold hover:border-[#7bb03b] transition-colors"
            >
              🛒 Cliente
            </button>
            <button
              onClick={() => handleQuickDemo("manager")}
              className="px-2 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold hover:border-amber-500 transition-colors"
            >
              📦 Encargado
            </button>
            <button
              onClick={() => handleQuickDemo("admin")}
              className="px-2 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold hover:border-purple-500 transition-colors"
            >
              ⚡ SuperAdmin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">Nombre Completo (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: Ana María"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">Tipo de Usuario</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors font-bold"
            >
              <option value="customer">Cliente Comprador</option>
              <option value="manager">Encargado de Inventario</option>
              <option value="admin">Super Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#7bb03b] hover:bg-[#5C8A26] text-white font-black rounded-xl shadow-lg shadow-[#7bb03b]/20 transition-all text-base mt-2"
          >
            Ingresar a la Plataforma
          </button>
        </form>

        <div className="text-center">
          <a href="/" className="text-xs font-bold text-[#7bb03b] hover:underline">
            ← Volver al Catálogo Principal
          </a>
        </div>
      </div>
    </main>
  );
}
