"use client";

import { useState } from "react";
import { useAuth, Role } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, theme, toggleTheme } = useAuth();
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");

  // Campos adicionales requeridos para el cliente
  const [phone, setPhone] = useState("");
  const [cedula, setCedula] = useState("");
  const [isRoblesResident, setIsRoblesResident] = useState(true); // default: vive en Urb. Los Robles
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [otherAddress, setOtherAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) return;

    if (isRegistering) {
      // Simulación de verificación de campos únicos en base de datos (Correo, Cédula, Teléfono)
      const existingUsers = JSON.parse(localStorage.getItem("rm_registered_users") || "[]");
      
      const emailExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      const cedulaExists = existingUsers.some((u: any) => u.cedula.toLowerCase() === cedula.toLowerCase());
      const phoneExists = existingUsers.some((u: any) => u.phone === phone);

      if (emailExists) {
        setErrorMessage("⚠️ Este correo electrónico ya se encuentra registrado.");
        return;
      }
      if (cedulaExists) {
        setErrorMessage("⚠️ Esta cédula de identidad ya pertenece a una cuenta registrada.");
        return;
      }
      if (phoneExists) {
        setErrorMessage("⚠️ Este número de teléfono ya está asociado a otra cuenta.");
        return;
      }

      // Guardar usuario registrado con datos únicos
      const newUser = { email, name, phone, cedula, role: "customer" };
      localStorage.setItem("rm_registered_users", JSON.stringify([...existingUsers, newUser]));

      login(email, "customer", name);
      router.push("/");
    } else {
      login(email, role, name);
      if (role === "admin" || role === "manager") {
        router.push("/admin");
      } else {
        router.push("/");
      }
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
    <main className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col justify-center items-center p-4 transition-colors py-10">
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

      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#7bb03b] text-white rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-lg">
            RM
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            {isRegistering ? "Crear Cuenta de Cliente" : "Iniciar Sesión"}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {isRegistering ? "Regístrate para tus compras en Roble Market" : "Accede a tu cuenta en Roble Market"}
          </p>
        </div>

        {/* MODO CONMUTADOR LOGIN / REGISTRO */}
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              !isRegistering
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                : "text-stone-500 dark:text-stone-400"
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(true);
              setRole("customer");
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              isRegistering
                ? "bg-[#7bb03b] text-white shadow-sm"
                : "text-stone-500 dark:text-stone-400"
            }`}
          >
            Registrarme como Cliente
          </button>
        </div>

        {/* DEMO ACCESOS RÁPIDOS (SOLO EN INICIAR SESIÓN) */}
        {!isRegistering && (
          <div className="bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700/50 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-center">
              Acceso Rápido Demo
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("customer")}
                className="px-2 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-[11px] font-bold hover:border-[#7bb03b] transition-colors"
              >
                🛒 Cliente
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("manager")}
                className="px-2 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-[11px] font-bold hover:border-amber-500 transition-colors"
              >
                📦 Encargado
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="px-2 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-[11px] font-bold hover:border-purple-500 transition-colors"
              >
                ⚡ Admin
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Ana María Gómez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors text-sm font-medium"
            />
          </div>

          {/* CAMPOS ADICIONALES PARA REGISTRO DE CLIENTE */}
          {isRegistering && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Número de Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 0414-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Cédula de Identidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: V-12345678"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] transition-colors text-sm font-medium"
                  />
                </div>
              </div>

              {/* SELECCIÓN BONITA DE DIRECCIÓN: ¿VIVES EN LOS ROBLES? */}
              <div className="p-4 bg-[#7bb03b]/5 dark:bg-[#7bb03b]/10 border-2 border-[#7bb03b]/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                    🏡 ¿Vives en Urb. Los Robles (Araure)?
                  </span>

                  {/* CASILLA / TOGGLE BONITO */}
                  <div className="flex bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                    <button
                      type="button"
                      onClick={() => setIsRoblesResident(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                        isRoblesResident
                          ? "bg-[#7bb03b] text-white shadow-sm"
                          : "text-stone-500 dark:text-stone-400"
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRoblesResident(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                        !isRoblesResident
                          ? "bg-stone-700 text-white shadow-sm"
                          : "text-stone-500 dark:text-stone-400"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* DESPLIEGUE SEGÚN RESPUESTA */}
                {isRoblesResident ? (
                  <div className="grid grid-cols-2 gap-3 pt-1 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-stone-500 dark:text-stone-400 mb-1">
                        Calle / Avenida *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Calle 3"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-stone-500 dark:text-stone-400 mb-1">
                        Número de Casa / Apto *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Casa #12-A"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] text-xs font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 animate-in fade-in duration-200">
                    <label className="block text-[10px] font-extrabold uppercase text-stone-500 dark:text-stone-400 mb-1">
                      Especifica tu Dirección de Entrega *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Ej: Urb. Villa Antigua, Calle Principal, Casa Nro. 45"
                      value={otherAddress}
                      onChange={(e) => setOtherAddress(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-[#7bb03b] text-xs font-medium"
                    />
                  </div>
                )}
              </div>
            </>
          )}



          <button
            type="submit"
            className="w-full py-4 bg-[#7bb03b] hover:bg-[#5C8A26] text-white font-black rounded-xl shadow-lg shadow-[#7bb03b]/20 transition-all text-sm mt-2"
          >
            {isRegistering ? "Crear Mi Cuenta de Cliente" : "Ingresar a la Plataforma"}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs font-bold text-[#7bb03b] hover:underline">
            ← Volver al Catálogo Principal
          </a>
        </div>
      </div>
    </main>
  );
}
