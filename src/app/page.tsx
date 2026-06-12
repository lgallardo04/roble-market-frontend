"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Mock Data
const PRODUCTS = [
  { id: 1, name: "Harina PAN Blanca 1Kg", price: 1.20, stock: 150, image: "https://via.placeholder.com/300x300.webp?text=Harina+PAN" },
  { id: 2, name: "Arroz Mary Tradicional 1Kg", price: 1.10, stock: 0, image: "https://via.placeholder.com/300x300.webp?text=Arroz+Mary" },
  { id: 3, name: "Mantequilla Mavesa 500g", price: 2.50, stock: 45, image: "https://via.placeholder.com/300x300.webp?text=Mavesa" },
  { id: 4, name: "Café Fama de América 500g", price: 4.00, stock: 20, image: "https://via.placeholder.com/300x300.webp?text=Cafe" },
  { id: 5, name: "Azúcar Montalbán 1Kg", price: 1.30, stock: 0, image: "https://via.placeholder.com/300x300.webp?text=Azucar" },
  { id: 6, name: "Aceite Vatel 1L", price: 3.20, stock: 80, image: "https://via.placeholder.com/300x300.webp?text=Aceite" },
];

const CROSS_SELL_PRODUCTS = [
  { id: 10, name: "Nutella 350g", price: 5.50, stock: 10, image: "https://via.placeholder.com/150x150.webp?text=Nutella" },
  { id: 11, name: "Coca-Cola 2L", price: 2.00, stock: 30, image: "https://via.placeholder.com/150x150.webp?text=Coca-Cola" },
  { id: 12, name: "Galletas Oreo", price: 1.50, stock: 50, image: "https://via.placeholder.com/150x150.webp?text=Oreo" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("DELIVERY");

  const filteredProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalCart = cart.reduce((acc, item) => acc + item.price, 0);



  const addToCart = (product: any) => {
    if (product.stock > 0) {
      setCart([...cart, product]);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9faf7] text-stone-800 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b-4 border-[#7bb03b] p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#7bb03b] text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">RM</div>
            <div className="text-2xl font-black tracking-tight text-stone-900">EL ROBLE <span className="text-[#7bb03b] font-bold">MARKET</span></div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <input 
              type="text" 
              placeholder="¿Qué estás buscando hoy?" 
              className="w-full py-3 px-5 rounded-full text-stone-800 bg-stone-100 border-2 border-transparent focus:outline-none focus:bg-white focus:border-[#7bb03b] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute right-4 top-3.5 h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="relative flex items-center gap-2 text-stone-700 hover:text-[#5C8A26] hover:bg-[#7bb03b]/10 px-4 py-2 rounded-xl transition-all"
              onClick={() => setShowCheckout(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="font-bold hidden sm:inline">Carrito</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d9381e] text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>



      {/* CATALOG */}
      <section className="max-w-6xl mx-auto p-4 py-10">
        <h2 className="text-3xl font-black mb-8 text-[#5C8A26] flex items-center gap-3">
          <svg className="w-8 h-8 text-[#8B5A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          Productos Destacados
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl hover:border-[#7bb03b]/30 transition-all flex flex-col relative group">
              {/* STOCKS OVERLAY */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-[#d9381e] text-white font-black py-2 px-6 rounded-lg transform -rotate-12 shadow-2xl text-xl tracking-widest border-2 border-white/50">
                    AGOTADO
                  </span>
                </div>
              )}
              
              <div className="relative h-56 w-full bg-stone-50 p-6">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className={`object-contain transition-transform duration-500 group-hover:scale-110 ${product.stock === 0 ? 'grayscale opacity-50' : ''}`}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow border-t border-stone-100">
                <h3 className="text-sm sm:text-base font-bold text-stone-800 line-clamp-2 mb-2 leading-tight">{product.name}</h3>
                <p className="text-2xl font-black text-[#5C8A26] mt-auto">${product.price.toFixed(2)}</p>
                <button 
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                  className={`mt-4 w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
                    product.stock > 0 
                      ? 'bg-[#7bb03b]/10 text-[#5C8A26] hover:bg-[#7bb03b] hover:text-white hover:shadow-md' 
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 text-stone-500 bg-white rounded-3xl border border-dashed border-stone-300 mt-8">
            <svg className="mx-auto h-16 w-16 text-stone-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xl font-medium">No encontramos productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </section>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 bg-stone-900/70 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm transition-opacity">
          <div className="bg-[#f9faf7] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-stone-200">
            <div className="p-5 bg-white border-b border-stone-200 text-stone-900 flex justify-between items-center">
              <h2 className="font-black text-2xl tracking-tight flex items-center gap-3">
                <span className="bg-[#7bb03b] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">{cart.length}</span>
                Tu Carrito
              </h2>
              <button onClick={() => setShowCheckout(false)} className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-20 w-20 text-stone-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <p className="text-stone-500 font-bold text-xl mb-4">Tu carrito está vacío.</p>
                  <button onClick={() => setShowCheckout(false)} className="text-[#5C8A26] font-bold hover:underline">Continuar comprando</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* METODO DE DESPACHO */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                    <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#8B5A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Método de Despacho
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'DELIVERY' ? 'border-[#7bb03b] bg-[#7bb03b]/5 text-[#5C8A26] shadow-inner' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                        <input type="radio" name="delivery" value="DELIVERY" checked={deliveryMethod === 'DELIVERY'} onChange={() => setDeliveryMethod('DELIVERY')} className="hidden" />
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span className="font-black">Delivery</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'PICKUP' ? 'border-[#7bb03b] bg-[#7bb03b]/5 text-[#5C8A26] shadow-inner' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                        <input type="radio" name="delivery" value="PICKUP" checked={deliveryMethod === 'PICKUP'} onChange={() => setDeliveryMethod('PICKUP')} className="hidden" />
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <span className="font-black">Pickup</span>
                      </label>
                    </div>
                  </div>

                  {/* RESUMEN */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                    <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#8B5A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      Resumen del Pedido
                    </h3>
                    <div className="text-stone-600 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-stone-500">Subtotal ({cart.length} items)</span>
                        <span className="font-bold text-stone-800">${totalCart.toFixed(2)}</span>
                      </div>
                      {deliveryMethod === 'DELIVERY' && (
                        <div className="flex justify-between items-center text-[#8B5A2B] bg-[#8B5A2B]/10 p-3 rounded-lg -mx-3">
                          <span className="font-bold">Delivery (Zona Centro)</span>
                          <span className="font-black">$2.00</span>
                        </div>
                      )}
                      <div className="border-t-2 border-stone-100 pt-4 mt-2 flex justify-between items-center">
                        <span className="font-black text-stone-800 text-xl">Total a Pagar</span>
                        <span className="font-black text-[#5C8A26] text-3xl">${(totalCart + (deliveryMethod === 'DELIVERY' ? 2 : 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* DATOS DE PAGO */}
                  <div className="bg-gradient-to-br from-white to-[#7bb03b]/5 p-6 rounded-2xl shadow-sm border border-[#7bb03b]/30 relative overflow-hidden">
                    <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2 relative z-10">
                      <svg className="w-5 h-5 text-[#5C8A26]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Datos de Pago Móvil
                    </h3>
                    <div className="space-y-3 text-sm text-stone-700 relative z-10">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm">
                        <span className="text-stone-500 mb-1 sm:mb-0 font-medium">Banco:</span> 
                        <strong className="text-right text-stone-900 font-bold">0102 - BDV / 0105 - Mercantil</strong>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm">
                        <span className="text-stone-500 mb-1 sm:mb-0 font-medium">Teléfono:</span> 
                        <strong className="text-right text-stone-900 font-bold">0414-1234567</strong>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm">
                        <span className="text-stone-500 mb-1 sm:mb-0 font-medium">Cédula/RIF:</span> 
                        <strong className="text-right text-stone-900 font-bold">J-12345678-9</strong>
                      </div>
                      <div className="pt-4">
                        <label className="block text-xs font-black text-stone-500 mb-2 uppercase tracking-widest">Referencia de Pago (Últimos 6 dígitos)</label>
                        <input type="text" placeholder="Ej: 345678" className="w-full p-4 bg-white border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#7bb03b]/20 focus:border-[#7bb03b] outline-none transition-all font-mono text-xl tracking-widest text-center shadow-inner" />
                      </div>
                    </div>
                  </div>

                  {/* CROSS SELLING CAROUSEL */}
                  <div className="mt-8 border-t border-stone-200 pt-6">
                    <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                      <span className="bg-[#8B5A2B]/10 text-[#8B5A2B] p-1.5 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </span>
                      A los clientes que llevan esto también les gusta...
                    </h3>
                    
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                      {CROSS_SELL_PRODUCTS.map(product => (
                        <div key={product.id} className="min-w-[140px] flex-shrink-0 bg-white border border-stone-200 rounded-xl overflow-hidden snap-start shadow-sm">
                          <div className="h-24 bg-stone-50 relative p-2">
                            <Image src={product.image} alt={product.name} fill className="object-contain" />
                          </div>
                          <div className="p-3">
                            <h4 className="text-xs font-bold text-stone-800 line-clamp-1 mb-1">{product.name}</h4>
                            <p className="text-sm font-black text-[#5C8A26] mb-2">${product.price.toFixed(2)}</p>
                            <button onClick={() => addToCart(product)} className="w-full py-1.5 text-xs font-bold bg-stone-100 text-stone-600 rounded-lg hover:bg-[#7bb03b] hover:text-white transition-colors">
                              + Agregar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-stone-200">
                <button className="w-full bg-[#5C8A26] text-white font-black py-4 rounded-xl shadow-[0_8px_20px_rgba(92,138,38,0.3)] hover:bg-[#4B692F] hover:shadow-[0_10px_25px_rgba(92,138,38,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Confirmar y Procesar Orden
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
