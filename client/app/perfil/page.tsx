"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, Settings, ChevronRight, User, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto font-sans">
      
      <header className="mt-4 mb-12 text-center">
        <h1 className="text-xl font-black uppercase italic tracking-tighter text-white">Perfil</h1>
      </header>

      <section className="flex flex-col items-center mb-12">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-zinc-700" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl border-4 border-black">
            <Settings size={16} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black italic uppercase tracking-tight leading-none mb-2">
          {session?.user?.name || "Usuário"}
        </h2>
        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
          {session?.user?.email || "email@exemplo.com"}
        </p>
      </section>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 px-2 mb-4">
          Configurações
        </p>

        <Link 
          href="/perfil/editar" 
          className="w-full bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-colors">
              <Settings size={20} />
            </div>
            <span className="font-black italic uppercase text-sm text-zinc-200">Editar Dados</span>
          </div>
          <ChevronRight size={18} className="text-zinc-600" />
        </Link>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-950/20 border border-red-900/30 p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all mt-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-900/20 flex items-center justify-center text-red-500">
              <LogOut size={20} />
            </div>
            <span className="font-black italic uppercase text-sm text-red-500">Sair da Conta</span>
          </div>
        </button>
      </div>

    </main>
  );
}