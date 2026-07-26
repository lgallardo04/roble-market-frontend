"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";

// Mock Expanded Products Data with Categories & Unit Info
const PRODUCTS = [
  { id: 1, name: "Harina PAN Blanca 1Kg", category: "Víveres", price: 1.20, stock: 150, image: "https://via.placeholder.com/300x300.webp?text=Harina+PAN", unit: "1 Kg" },
  { id: 2, name: "Arroz Mary Tradicional 1Kg", category: "Víveres", price: 1.10, stock: 0, image: "https://via.placeholder.com/300x300.webp?text=Arroz+Mary", unit: "1 Kg" },
  { id: 3, name: "Mantequilla Mavesa 500g", category: "Refrigerados", price: 2.50, stock: 45, image: "https://via.placeholder.com/300x300.webp?text=Mavesa", unit: "500g" },
  { id: 4, name: "Café Fama de América 500g", category: "Bebidas", price: 4.00, stock: 20, image: "https://via.placeholder.com/300x300.webp?text=Cafe", unit: "500g" },
  { id: 5, name: "Azúcar Montalbán 1Kg", category: "Víveres", price: 1.30, stock: 0, image: "https://via.placeholder.com/300x300.webp?text=Azucar", unit: "1 Kg" },
  { id: 6, name: "Aceite Vatel 1L", category: "Víveres", price: 3.20, stock: 80, image: "https://via.placeholder.com/300x300.webp?text=Aceite", unit: "1 Litro" },
  { id: 7, name: "Queso Llanero Blanco (Kg)", category: "Charcutería", price: 6.50, stock: 15, image: "https://via.placeholder.com/300x300.webp?text=Queso+Llanero", unit: "Kg (Ajustable)", isVariable: true },
  { id: 8, name: "Jamón de Espalda Plumrose", category: "Charcutería", price: 8.90, stock: 10, image: "https://via.placeholder.com/300x300.webp?text=Jamon", unit: "Kg (Ajustable)", isVariable: true },
];

const CROSS_SELL_PRODUCTS = [
  { id: 10, name: "Nutella 350g", price: 5.50, stock: 10, image: "https://via.placeholder.com/150x150.webp?text=Nutella" },
  { id: 11, name: "Coca-Cola 2L", price: 2.00, stock: 30, image: "https://via.placeholder.com/150x150.webp?text=Coca-Cola" },
  { id: 12, name: "Galletas Oreo", price: 1.50, stock: 50, image: "https://via.placeholder.com/150x150.webp?text=Oreo" },
];

const CATEGORIES = ["TODOS", "Víveres", "Charcutería", "Refrigerados", "Bebidas"];

// Tasa BCV estimada (USD a VES)
const BCV_RATE = 36.50;

export default function Home() {
  const { user, theme, toggleTheme, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [cart, setCart] = useState<{ product: typeof PRODUCTS[0]; quantity: number }[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "TODOS" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Funciones intuitivas del Carrito
  const addToCart = (product: typeof PRODUCTS[0]) => {
    if (product.stock <= 0) return;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`⚠️ Stock máximo alcanzado para ${product.name}`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    showToast(`🛒 ${product.name} agregado al carrito`);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) {
              showToast(`⚠️ Stock máximo disponible (${item.product.stock})`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as typeof prevCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    showToast("🗑️ Producto eliminado del carrito");
  };

  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalUSD = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCostUSD = deliveryMethod === "DELIVERY" ? 2.00 : 0.00;
  const totalUSD = subtotalUSD + deliveryCostUSD;
  const totalVES = totalUSD * BCV_RATE;

  return (
    <main className="min-h-screen bg-[#f9faf7] dark:bg-stone-950 text-stone-800 dark:text-stone-100 font-sans transition-colors pb-24 md:pb-12">
      {/* TOAST FLOATING NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-6 py-3 rounded-full shadow-2xl font-bold text-xs animate-bounce flex items-center gap-2 border border-white/20">
          {toastMessage}
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="bg-white dark:bg-stone-900 border-b-4 border-[#7bb03b] p-4 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full md:w-auto">
            <a href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#7bb03b] text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">
                RM
              </div>
              <div className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">
                EL ROBLE <span className="text-[#7bb03b] font-bold">MARKET</span>
              </div>
            </a>

            {/* BOTÓN MODO OSCURO & ACCESOS EN MÓVIL */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-bold"
                title="Modo Oscuro"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              {user ? (
                <a
                  href={user.role === "customer" ? "/account" : "/admin"}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-full text-xs font-extrabold border border-stone-200 dark:border-stone-700"
                >
                  {user.role === "customer" ? "👤 Mi Cuenta" : "⚡ Admin"}
                </a>
              ) : (
                <a
                  href="/login"
                  className="px-3 py-1.5 bg-[#7bb03b] text-white rounded-full text-xs font-extrabold shadow-sm"
                >
                  Ingresar
                </a>
              )}
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="¿Qué estás buscando hoy?"
              className="w-full py-3 px-5 pr-12 rounded-full text-stone-800 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 border-2 border-transparent focus:outline-none focus:bg-white dark:focus:bg-stone-900 focus:border-[#7bb03b] transition-colors text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute right-4 top-3.5 h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* ACCIONES Y PERFIL */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-bold hover:scale-105 transition-transform"
            >
              {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "admin" || user.role === "manager" ? (
                  <a
                    href="/admin"
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    ⚡ Panel Admin
                  </a>
                ) : (
                  <a
                    href="/account"
                    className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl hover:bg-stone-200 transition-all flex items-center gap-1.5"
                  >
                    👤 Mi Cuenta
                  </a>
                )}
                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-red-500 text-xs font-bold"
                  title="Cerrar Sesión"
                >
                  🚪
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 bg-[#7bb03b] hover:bg-[#5C8A26] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Iniciar Sesión
              </a>
            )}

            {/* CARRITO BUTTON DESKTOP */}
            <button
              className="relative flex items-center gap-2 bg-[#7bb03b]/10 text-[#5C8A26] hover:bg-[#7bb03b] hover:text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
              onClick={() => setShowCartDrawer(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Carrito</span>
              {totalItemsInCart > 0 && (
                <span className="bg-[#d9381e] text-white text-xs px-2 py-0.5 rounded-full font-black shadow-sm">
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* TASA BCV INFORMATIVA */}
      <div className="bg-[#5C8A26] text-white text-xs font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span>🇻🇪 Tasa Oficial BCV del día: <strong>Bs. {BCV_RATE.toFixed(2)} / USD</strong></span>
      </div>

      {/* CATEGORÍAS BARRA DE FILTROS */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? "bg-[#7bb03b] text-white border-[#7bb03b] shadow-md scale-105"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-[#7bb03b]"
              }`}
            >
              {cat === "TODOS" ? "🛒 Todos los Productos" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section className="max-w-6xl mx-auto p-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white flex items-center gap-3">
            <span className="w-3 h-3 bg-[#7bb03b] rounded-full"></span>
            {selectedCategory === "TODOS" ? "Catálogo General" : selectedCategory}
          </h2>
          <span className="text-xs font-bold text-stone-400">{filteredProducts.length} productos encontrados</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => {
            const itemInCart = cart.find(i => i.product.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-xl hover:border-[#7bb03b]/40 transition-all flex flex-col relative group"
              >
                {/* ETIQUETA AGOTADO */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-stone-950/70 z-10 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-[#d9381e] text-white font-black py-2 px-5 rounded-lg transform -rotate-12 shadow-2xl text-base tracking-widest border-2 border-white/50">
                      AGOTADO
                    </span>
                  </div>
                )}

                <div className="relative h-48 w-full bg-stone-50 dark:bg-stone-800/50 p-4">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform" />
                  <span className="absolute top-3 left-3 bg-stone-200/80 dark:bg-stone-700/80 text-stone-700 dark:text-stone-200 text-[10px] font-black px-2.5 py-1 rounded-md">
                    {product.unit}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-stone-800 dark:text-stone-100 line-clamp-2">{product.name}</h3>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 font-medium mt-0.5">{product.category}</p>
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <p className="text-xl font-black text-[#5C8A26] dark:text-[#7bb03b]">${product.price.toFixed(2)}</p>
                      <p className="text-[10px] text-stone-400 font-bold">Bs. {(product.price * BCV_RATE).toFixed(2)}</p>
                    </div>

                    {/* BOTÓN INTUITIVO DE AGREGAR / CANTIDAD */}
                    {itemInCart ? (
                      <div className="flex items-center gap-1.5 bg-[#7bb03b] text-white p-1 rounded-xl shadow-md">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-7 h-7 flex items-center justify-center font-black rounded-lg hover:bg-black/20"
                        >
                          -
                        </button>
                        <span className="font-black text-xs px-1">{itemInCart.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-7 h-7 flex items-center justify-center font-black rounded-lg hover:bg-black/20"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={product.stock === 0}
                        onClick={() => addToCart(product)}
                        className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#7bb03b] hover:text-white text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition-all shadow-sm disabled:opacity-50"
                      >
                        + Agregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER BAR EN MÓVIL PARA CARRITO FLOTANTE */}
      {totalItemsInCart > 0 && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setShowCartDrawer(true)}
            className="w-full bg-[#7bb03b] text-white py-3.5 px-6 rounded-2xl font-black shadow-2xl flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white text-[#7bb03b] w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
                {totalItemsInCart}
              </span>
              <span>Ver Carrito de Compra</span>
            </div>
            <span>${totalUSD.toFixed(2)} (Bs. {totalVES.toFixed(2)})</span>
          </button>
        </div>
      )}

      {/* CARRITO DRAWER SIDEBAR */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white dark:bg-stone-900 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* CABECERA DEL CARRITO */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-4">
                <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  🛒 Tu Carrito ({totalItemsInCart})
                </h2>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-2 text-stone-400 hover:text-stone-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* LISTA DE ITEMS DEL CARRITO */}
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-5xl">🛒</div>
                  <p className="font-bold text-stone-500">Tu carrito está vacío</p>
                  <p className="text-xs text-stone-400">Agrega productos del catálogo para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative bg-white dark:bg-stone-800 rounded-xl p-1">
                          <Image src={product.image} alt={product.name} fill className="object-contain" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-stone-800 dark:text-stone-100 line-clamp-1">{product.name}</h4>
                          <p className="text-xs font-black text-[#5C8A26] dark:text-[#7bb03b]">
                            ${(product.price * quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="px-2 py-0.5 font-black text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-xs">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="px-2 py-0.5 font-black text-xs"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RESUMEN Y PROCESAR COMPRA */}
            {cart.length > 0 && (
              <div className="border-t border-stone-200 dark:border-stone-800 pt-4 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">${subtotalUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Delivery Estimado</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">${deliveryCostUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black border-t border-stone-100 dark:border-stone-800 pt-2">
                    <span>Total a Pagar</span>
                    <div className="text-right">
                      <span className="text-[#5C8A26] dark:text-[#7bb03b]">${totalUSD.toFixed(2)}</span>
                      <p className="text-[10px] text-stone-400 font-normal">Bs. {totalVES.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    setShowCheckout(true);
                  }}
                  className="w-full py-4 bg-[#7bb03b] hover:bg-[#5C8A26] text-white font-black rounded-2xl shadow-xl shadow-[#7bb03b]/20 transition-all text-sm"
                >
                  Ir a Procesar Pedido →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CHECKOUT FINAL */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 w-full max-w-lg space-y-6 border border-stone-200 dark:border-stone-800 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-lg font-black">Finalizar Compra</h3>
              <button onClick={() => setShowCheckout(false)} className="text-stone-400 font-bold">✕</button>
            </div>

            {/* SELECCIÓN MÉTODO */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Método de Entrega</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMethod("DELIVERY")}
                  className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    deliveryMethod === "DELIVERY"
                      ? "border-[#7bb03b] bg-[#7bb03b]/10 text-[#5C8A26]"
                      : "border-stone-200 dark:border-stone-700"
                  }`}
                >
                  🚚 Delivery ($2.00)
                </button>
                <button
                  onClick={() => setDeliveryMethod("PICKUP")}
                  className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    deliveryMethod === "PICKUP"
                      ? "border-[#7bb03b] bg-[#7bb03b]/10 text-[#5C8A26]"
                      : "border-stone-200 dark:border-stone-700"
                  }`}
                >
                  🏪 Retiro en Tienda (Gratis)
                </button>
              </div>
            </div>

            {/* DATOS DE PAGO MÓVIL */}
            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl space-y-2 border border-stone-200 dark:border-stone-700">
              <p className="text-xs font-bold uppercase text-stone-400">Datos para Pago Móvil</p>
              <div className="text-xs space-y-1 text-stone-700 dark:text-stone-300">
                <p>• <strong>Banco:</strong> Banco de Venezuela (0102) / Mercantil (0105)</p>
                <p>• <strong>Cédula / RIF:</strong> J-12345678-9</p>
                <p>• <strong>Teléfono:</strong> 0414-1234567</p>
                <p className="pt-2 text-base font-black text-[#5C8A26]">
                  Monto a Transferir: Bs. {totalVES.toFixed(2)} (${totalUSD.toFixed(2)})
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Referencia del Pago Móvil</label>
              <input
                type="text"
                placeholder="Ej: 849204"
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-center font-mono font-bold text-lg outline-none focus:border-[#7bb03b]"
              />
            </div>

            <button
              onClick={() => {
                alert("🎉 ¡Pedido confirmado con éxito! Estaremos procesando tu orden.");
                setCart([]);
                setShowCheckout(false);
              }}
              className="w-full py-4 bg-[#7bb03b] hover:bg-[#5C8A26] text-white font-black rounded-2xl shadow-xl shadow-[#7bb03b]/20 text-sm"
            >
              Confirmar Pago y Finalizar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
