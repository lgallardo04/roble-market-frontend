"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

// Initial Products Data
const INITIAL_PRODUCTS = [
  { id: 1, name: "Harina PAN Blanca 1Kg", category: "Víveres", stock: 150, price: 1.20, minStock: 20, is_variable_weight: false },
  { id: 2, name: "Queso Llanero (Kg)", category: "Charcutería", stock: 5, price: 6.50, minStock: 10, is_variable_weight: true },
  { id: 3, name: "Arroz Mary Tradicional 1Kg", category: "Víveres", stock: 0, price: 1.10, minStock: 15, is_variable_weight: false },
  { id: 4, name: "Mantequilla Mavesa 500g", category: "Refrigerados", stock: 45, price: 2.50, minStock: 10, is_variable_weight: false },
  { id: 5, name: "Café Fama de América 500g", category: "Bebidas", stock: 20, price: 4.00, minStock: 5, is_variable_weight: false },
  { id: 6, name: "Aceite Vatel 1L", category: "Víveres", stock: 80, price: 3.20, minStock: 15, is_variable_weight: false },
];

const INITIAL_ORDERS = [
  { id: 101, customer: "Juan Pérez", status: "PAID", total: 15.50, itemsCount: 4, time: "10:30 AM", method: "DELIVERY" },
  { id: 102, customer: "María Gómez", status: "PENDING", total: 8.00, itemsCount: 2, time: "10:45 AM", method: "PICKUP" },
  { id: 103, customer: "Luis Díaz", status: "PREPARING", total: 22.10, itemsCount: 6, time: "11:00 AM", method: "DELIVERY" },
];

export default function AdminDashboard() {
  const { user, theme, toggleTheme, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "finance" | "users">("orders");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("TODOS");

  // Modal para agregar/editar producto
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Víveres");
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdPrice, setNewProdPrice] = useState(1.0);
  const [newProdVariable, setNewProdVariable] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Redireccionar si no está autenticado o es cliente común
  useEffect(() => {
    if (user && user.role === "customer") {
      router.push("/");
    }
  }, [user, router]);

  // Simular la llegada de un nuevo pedido pagado
  useEffect(() => {
    const timer = setTimeout(() => {
      const newOrder = {
        id: 104,
        customer: "Ana Martínez",
        status: "PAID",
        total: 12.00,
        itemsCount: 3,
        time: "11:15 AM",
        method: "DELIVERY",
        isNew: true,
      };
      setOrders(prev => [newOrder, ...prev]);
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio autoplay prevented"));
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const toggleStock = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 50 } : p));
  };

  const updateStockValue = (id: number, delta: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  const updateOrderStatus = (id: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus, isNew: false } : o));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    const newProd = {
      id: Date.now(),
      name: newProdName,
      category: newProdCategory,
      stock: Number(newProdStock),
      price: Number(newProdPrice),
      minStock: 5,
      is_variable_weight: newProdVariable,
    };
    setProducts([...products, newProd]);
    setShowProductModal(false);
    setNewProdName("");
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === "TODOS" || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const isSuperAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-100 font-sans transition-colors">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* HEADER BAR */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7bb03b] text-white rounded-full flex items-center justify-center font-black text-lg shadow-md">
              RM
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
                Panel de Control 
                <span className={`text-xs px-2.5 py-0.5 rounded-full uppercase font-extrabold ${isSuperAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                  {isSuperAdmin ? "⚡ SuperAdmin" : "📦 Encargado"}
                </span>
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Usuario: <strong>{user?.name || "Administrador"}</strong> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 hover:scale-105 transition-transform"
            >
              {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
            </button>

            <a
              href="/"
              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold rounded-xl transition-colors"
            >
              🛒 Ir a la Tienda
            </a>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900/50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* TAB NAVIGATION */}
        <div className="flex overflow-x-auto gap-2 bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'bg-[#7bb03b] text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
          >
            🔴 Pedidos en Vivo ({orders.length})
          </button>
          
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'inventory' ? 'bg-[#7bb03b] text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
          >
            📦 Revisión de Inventario ({products.length})
          </button>

          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab("finance")}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'finance' ? 'bg-purple-600 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                💰 Finanzas & Reportes
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                👥 Usuarios y Roles
              </button>
            </>
          )}
        </div>

        {/* TAB 1: PEDIDOS EN VIVO */}
        {activeTab === "orders" && (
          <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  Monitoreo de Pedidos
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">Visualiza y actualiza el estado de los despachos en tiempo real</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className={`p-5 rounded-2xl border-2 transition-all space-y-4 ${
                    order.status === 'PAID'
                      ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/40'
                  } ${(order as any).isNew ? 'animate-bounce' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200">
                        #{order.id}
                      </span>
                      <h3 className="font-extrabold text-base mt-2">{order.customer}</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{order.time} • {order.method}</p>
                    </div>

                    {isSuperAdmin ? (
                      <div className="text-right">
                        <span className="font-black text-lg text-[#7bb03b]">${order.total.toFixed(2)}</span>
                        <p className="text-[10px] text-stone-400">Total Venta</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="font-black text-sm text-stone-400">***.**</span>
                        <p className="text-[10px] text-stone-400">Oculto (Encargado)</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <label className="text-[11px] font-bold uppercase text-stone-400">Estado del Pedido</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#7bb03b]"
                    >
                      <option value="PENDING">⏳ Pendiente de Pago</option>
                      <option value="PAID">✅ Pagado (Confirmado)</option>
                      <option value="PREPARING">👨‍🍳 En Embalaje/Preparación</option>
                      <option value="ON_THE_WAY">🚚 En Camino con Delivery</option>
                      <option value="DELIVERED">🎉 Entregado al Cliente</option>
                    </select>

                    <button
                      onClick={() => alert(`Generando Ticket PDF para la Orden #${order.id}...`)}
                      className="w-full py-2 bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-1"
                    >
                      📄 Descargar Ticket PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: INVENTARIO (ACCESO A ENCARGADOS Y ADMINS) */}
        {activeTab === "inventory" && (
          <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black">Control e Inspección de Inventario</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">Actualiza stock rápidamente, repón productos o añade nuevos ítems</p>
              </div>

              <button
                onClick={() => setShowProductModal(true)}
                className="px-5 py-3 bg-[#7bb03b] hover:bg-[#5C8A26] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7bb03b]/20 transition-all flex items-center gap-2"
              >
                ➕ Agregar Nuevo Producto
              </button>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Buscar producto por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs outline-none focus:border-[#7bb03b]"
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold outline-none"
              >
                <option value="TODOS">Todas las Categorías</option>
                <option value="Víveres">Víveres</option>
                <option value="Charcutería">Charcutería</option>
                <option value="Refrigerados">Refrigerados</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase font-black">
                    <th className="p-3">Producto</th>
                    <th className="p-3">Categoría</th>
                    {isSuperAdmin && <th className="p-3">Precio USD</th>}
                    <th className="p-3">Estado Stock</th>
                    <th className="p-3 text-center">Ajuste Rápido</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      <td className="p-3 font-bold">
                        {p.name}
                        {p.is_variable_weight && (
                          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded text-[10px] font-black">
                            Peso Variable ⚖️
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-stone-500">{p.category}</td>
                      {isSuperAdmin && <td className="p-3 font-black text-[#7bb03b]">${p.price.toFixed(2)}</td>}
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          p.stock === 0
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            : p.stock <= p.minStock
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                        }`}>
                          {p.stock === 0 ? "AGOTADO" : `${p.stock} unidades`}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                          <button
                            onClick={() => updateStockValue(p.id, -5)}
                            className="px-2 py-1 bg-white dark:bg-stone-700 rounded-lg font-black text-xs hover:bg-stone-200"
                          >
                            -5
                          </button>
                          <span className="px-2 font-mono font-bold">{p.stock}</span>
                          <button
                            onClick={() => updateStockValue(p.id, 5)}
                            className="px-2 py-1 bg-white dark:bg-stone-700 rounded-lg font-black text-xs hover:bg-stone-200"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleStock(p.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                            p.stock > 0
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400 hover:bg-green-100'
                          }`}
                        >
                          {p.stock > 0 ? "Marcar Agotado" : "Reponer (50)"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: FINANZAS Y REPORTES (EXCLUSIVO SUPERADMIN) */}
        {activeTab === "finance" && isSuperAdmin && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ventas Totales del Mes</p>
                <h3 className="text-3xl font-black text-[#7bb03b] mt-2">$4,850.00</h3>
                <p className="text-xs text-green-600 font-bold mt-1">↑ +14% vs mes anterior</p>
              </div>

              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pedidos Procesados</p>
                <h3 className="text-3xl font-black text-stone-900 dark:text-white mt-2">142 Orders</h3>
                <p className="text-xs text-stone-500 mt-1">Promedio: $34.15 por pedido</p>
              </div>

              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Saldo Crédito VIP Otorgado</p>
                <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">$180.00</h3>
                <p className="text-xs text-stone-500 mt-1">Cashback de referidos activado</p>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <h3 className="text-lg font-black mb-4">Exportación de Reportes Financieros</h3>
              <p className="text-xs text-stone-500 mb-4">Genera reportes de cierre de caja diaria y conciliaciones de Pago Móvil.</p>
              <div className="flex gap-3">
                <button onClick={() => alert("Exportando Cierre Diario a CSV...")} className="px-4 py-2.5 bg-stone-800 text-white font-bold text-xs rounded-xl hover:bg-stone-900">
                  📊 Exportar Cierre Diario (CSV)
                </button>
                <button onClick={() => alert("Exportando Libro de Ventas en PDF...")} className="px-4 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700">
                  📄 Exportar Reporte Mensual (PDF)
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: USUARIOS Y ROLES (EXCLUSIVO SUPERADMIN) */}
        {activeTab === "users" && isSuperAdmin && (
          <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h2 className="text-xl font-black">Gestión de Personal y Permisos</h2>
            <div className="space-y-3">
              <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">Luis Gallardo (SuperAdmin)</h4>
                  <p className="text-xs text-stone-500">luis.gallardo@roblemarket.com</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-full font-black text-xs">
                  ADMINISTRADOR GLOBAL
                </span>
              </div>

              <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">Carlos Encargado (Manager)</h4>
                  <p className="text-xs text-stone-500">carlos.encargado@roblemarket.com</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-full font-black text-xs">
                  ENCARGADO INVENTARIO
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL CREACIÓN DE PRODUCTO */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 w-full max-w-md space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <h3 className="text-lg font-black">Agregar Nuevo Producto</h3>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Leche Completa 1L"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Categoría</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Víveres">Víveres</option>
                    <option value="Charcutería">Charcutería</option>
                    <option value="Refrigerados">Refrigerados</option>
                    <option value="Bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Precio ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs outline-none font-bold text-[#7bb03b]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={newProdVariable}
                      onChange={(e) => setNewProdVariable(e.target.checked)}
                      className="w-4 h-4 rounded text-[#7bb03b]"
                    />
                    Peso Variable ⚖️
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#7bb03b] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
