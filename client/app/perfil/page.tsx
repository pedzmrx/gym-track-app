import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { User, Settings, LogOut, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto">
      <header className="mt-8 mb-10 text-center">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Perfil</h1>
      </header>

      {/* Card do Usuário */}
      <section className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border-4 border-zinc-800 overflow-hidden shadow-2xl mb-4">
          {session.user.image ? (
            <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600">
              <User size={40} className="text-white" />
            </div>
          )}
        </div>
        <h2 className="text-xl font-black italic uppercase">{session.user.name}</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{session.user.email}</p>
      </section>

      {/* Configurações */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-4 mb-2">Configurações</h3>
        

        <div className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800 rounded-3xl group active:scale-[0.98] transition-all">
          <div className="flex items-center gap-3 text-zinc-400 group-hover:text-white">
            <Settings size={20} />
            <span className="font-bold text-sm">Editar Dados</span>
          </div>
          <ChevronRight size={18} className="text-zinc-700" />
        </div>

        <button className="w-full flex items-center gap-3 p-5 text-red-500 font-black italic uppercase text-sm border border-red-500/20 bg-red-500/5 rounded-3xl mt-8 active:scale-95 transition-all">
          <LogOut size={20} />
          Sair da Conta
        </button>
      </section>
    </main>
  );
}