"use client";

import { useState, useEffect, useRef } from "react";

// Mock Data
const MOCK_USER = {
  name: "Carlos (Manager)",
  role: "manager", // Puede ser 'admin' o 'manager'
};

const MOCK_PRODUCTS = [
  { id: 1, name: "Harina PAN Blanca 1Kg", stock: 150, price: 1.20, is_variable_weight: false },
  { id: 2, name: "Queso Llanero", stock: 5, price: 6.50, is_variable_weight: true },
  { id: 3, name: "Arroz Mary Tradicional 1Kg", stock: 0, price: 1.10, is_variable_weight: false },
];

const MOCK_ORDERS = [
  { id: 101, customer: "Juan Pérez", status: "PAID", total: 15.50, time: "10:30 AM" },
  { id: 102, customer: "María Gómez", status: "PENDING", total: 8.00, time: "10:45 AM" },
  { id: 103, customer: "Luis Díaz", status: "PREPARING", total: 22.10, time: "11:00 AM" },
];

export default function AdminDashboard() {
  const [role, setRole] = useState(MOCK_USER.role);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simular la llegada de un nuevo pedido pagado
  useEffect(() => {
    const timer = setTimeout(() => {
      const newOrder = {
        id: 104,
        customer: "Ana Martínez",
        status: "PAID",
        total: 12.00,
        time: "11:15 AM",
        isNew: true, // flag para animación
      };
      setOrders(prev => [newOrder, ...prev]);
      
      // Reproducir sonido
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio autoplay prevented"));
      }
    }, 5000); // Aparece a los 5 segundos

    return () => clearTimeout(timer);
  }, []);

  const toggleStock = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 50 } : p));
  };

  const updateOrderStatus = (id: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus, isNew: false } : o));
  };

  const generatePDF = (id: number) => {
    alert(`Generando Ticket PDF para la orden #${id}...`);
  };

  return (
    <div className="min-h-screen bg-stone-100 p-6 font-sans text-stone-800">
      {/* Audio oculto para notificaciones */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#5C8A26]">Panel de Control</h1>
          <p className="text-sm text-stone-500">Bienvenido, {MOCK_USER.name} | Rol: <span className="uppercase font-bold text-stone-700">{role}</span></p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRole('manager')} className={`px-4 py-2 rounded-lg text-sm font-bold ${role === 'manager' ? 'bg-stone-800 text-white' : 'bg-stone-200'}`}>Vista Manager</button>
          <button onClick={() => setRole('admin')} className={`px-4 py-2 rounded-lg text-sm font-bold ${role === 'admin' ? 'bg-[#5C8A26] text-white' : 'bg-stone-200'}`}>Vista Admin</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL DE PEDIDOS EN VIVO */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Pedidos en Vivo
          </h2>
          <div className="space-y-4">
            {orders.map(order => (
              <div 
                key={order.id} 
                className={`p-4 rounded-xl border-2 transition-all ${order.status === 'PAID' ? 'border-green-500 bg-green-50' : 'border-stone-200 bg-white'} ${(order as any).isNew ? 'animate-pulse' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">#{order.id} - {order.customer}</h3>
                    <p className="text-sm text-stone-500">{order.time}</p>
                  </div>
                  {/* RUTAS FINANCIERAS BLOQUEADAS PARA MANAGER */}
                  {role === 'admin' ? (
                    <div className="text-right">
                      <span className="font-black text-green-700">${order.total.toFixed(2)}</span>
                      <p className="text-xs text-stone-400">Ingreso Visible</p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="font-bold text-stone-400">***.**</span>
                      <p className="text-xs text-stone-400">Oculto (Manager)</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mt-4">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="p-2 bg-white border border-stone-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#7bb03b] outline-none"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="PAID">Pagado</option>
                    <option value="PREPARING">Preparando</option>
                    <option value="ON_THE_WAY">En Camino</option>
                    <option value="DELIVERED">Entregado</option>
                  </select>

                  <button 
                    onClick={() => generatePDF(order.id)}
                    className="px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Ticket PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PANEL DE INVENTARIO */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Gestión de Inventario (Rápida)</h2>
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-xl">
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <div className="flex gap-2 text-xs mt-1">
                    <span className={`px-2 py-1 rounded-md font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      Stock: {product.stock}
                    </span>
                    {product.is_variable_weight && (
                      <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 font-bold">
                        Peso Variable
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => toggleStock(product.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${product.stock > 0 ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}
                >
                  {product.stock > 0 ? 'Marcar Agotado' : 'Reponer Stock'}
                </button>
              </div>
            ))}
          </div>

          {/* RUTAS FINANCIERAS */}
          {role === 'admin' && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-bold text-blue-800 mb-2">Módulo Financiero (Solo Admin)</h3>
              <p className="text-sm text-blue-600 mb-3">Acceso a reportes de ventas, balances y cierres de caja.</p>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">Ver Reportes</button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
