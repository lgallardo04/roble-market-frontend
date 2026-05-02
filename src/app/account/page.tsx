"use client";

import { useState } from "react";

export default function AccountPage() {
  // Mock User Data
  const [user] = useState({
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    isVIP: true,
    referralCode: "CARLOSM-2026",
    referralLink: "https://roblemarket.com/ref/CARLOSM-2026",
    walletBalance: 45.00,
    referralsCount: 4,
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#f9faf7] text-stone-800 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-stone-200 to-stone-300 rounded-full flex items-center justify-center text-4xl shadow-inner relative">
            👤
            {user.isVIP && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg border-2 border-white transform rotate-3 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                VIP
              </div>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-black text-stone-900 mb-1">{user.name}</h1>
            <p className="text-stone-500 font-medium">{user.email}</p>
          </div>
          <div className="bg-[#7bb03b]/10 p-4 rounded-2xl border border-[#7bb03b]/20 text-center min-w-[150px]">
            <p className="text-[#5C8A26] font-bold text-sm uppercase tracking-widest mb-1">Saldo a Favor</p>
            <p className="text-3xl font-black text-stone-900">Bs. {user.walletBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* REFERRALS PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#7bb03b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              Gana con Roble Market
            </h2>
            <p className="text-stone-600 mb-6 leading-relaxed">
              Comparte tu enlace de referido con amigos y familiares. Recibirás <strong className="text-stone-900">Bs. 5.00</strong> en tu Saldo a Favor por la primera compra de cada persona que invites.
            </p>
            
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 relative">
              <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest">Tu Enlace de Referido</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={user.referralLink} 
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-stone-700 font-medium outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${copied ? 'bg-stone-800 text-white' : 'bg-[#7bb03b] text-white hover:bg-[#5C8A26]'}`}
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copiado
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-8 shadow-md text-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-200 mb-2">Estatus de Cliente</h2>
              {user.isVIP ? (
                <div>
                  <h3 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200 mb-4">Cliente VIP</h3>
                  <ul className="space-y-3 text-stone-300">
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Delivery gratis en pedidos mayores a Bs. 30
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Prioridad en preparación
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Acceso anticipado a ofertas
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="text-stone-300 mt-4">
                  <p className="mb-4">Realiza 3 compras más este mes para alcanzar el estatus VIP y disfrutar de beneficios exclusivos.</p>
                  <div className="w-full bg-stone-700 rounded-full h-3">
                    <div className="bg-[#7bb03b] h-3 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 bg-black/30 p-4 rounded-2xl flex items-center justify-between border border-white/10">
              <span className="font-medium text-stone-300">Amigos referidos este mes:</span>
              <span className="font-black text-2xl text-white">{user.referralsCount}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
