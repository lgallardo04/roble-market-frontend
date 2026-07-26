"use client";

import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { user, theme, toggleTheme } = useAuth();

  const userAccount = {
    name: user?.name || "Carlos Mendoza",
    email: user?.email || "carlos.mendoza@email.com",
    isVIP: user?.isVIP ?? true,
    ordersCount: 8,
  };

  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-100 font-sans p-4 sm:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER PERFIL */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 rounded-full flex items-center justify-center text-3xl shadow-inner relative">
              👤
              {userAccount.isVIP && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-white dark:border-stone-900 flex items-center gap-1">
                  VIP
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">{userAccount.name}</h1>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">{userAccount.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs bg-[#7bb03b]/10 text-[#5C8A26] dark:text-[#7bb03b] font-bold px-3 py-1 rounded-full">
                  Cliente Registrado
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={toggleTheme}
              className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-xs font-bold border border-stone-200 dark:border-stone-700 hover:scale-105 transition-transform"
            >
              {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
            </button>
            <a
              href="/"
              className="px-5 py-3 bg-[#7bb03b] hover:bg-[#5C8A26] text-white font-bold text-xs rounded-2xl shadow-md transition-all text-center flex-1 sm:flex-initial"
            >
              🛒 Ir a Comprar
            </a>
          </div>
        </div>

        {/* ESTATUS Y BENEFICIOS CLIENTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
              📦 Información de Compras
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
              Tus pedidos en línea son transmitidos directamente al sistema de caja central DianSoft para su facturación y despacho inmediato.
            </p>
            
            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 flex justify-between items-center">
              <div>
                <p className="text-xs text-stone-400 uppercase font-bold">Pedidos Realizados</p>
                <p className="text-2xl font-black text-stone-800 dark:text-stone-100">{userAccount.ordersCount} compras</p>
              </div>
              <span className="text-2xl">🛍️</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-8 shadow-md text-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-200 mb-1">Beneficios de Membresía</h2>
              <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200 mb-4">
                {userAccount.isVIP ? "Cliente Frecuente VIP" : "Cliente Preferencial"}
              </h3>
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400 font-bold">✓</span>
                  Prioridad en preparación y embalaje de pedidos
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400 font-bold">✓</span>
                  Atención directa vía WhatsApp para confirmaciones
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400 font-bold">✓</span>
                  Descuentos especiales comunicados en tienda
                </li>
              </ul>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-stone-400">
              Sincronizado automáticamente con la caja principal de Roble Market (DianSoft).
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
