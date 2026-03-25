import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardStats } from "./actions";
import { redirect } from "next/navigation";
import { Activity, Flame, ChevronRight, Dumbbell, Calendar, Zap } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { ultimosLogs, logsRecentas } = await getDashboardStats((session.user as any).id);
  const diasSemana = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const hoje = new Date().getDay();

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto">
      
      {/* Header */}
      <header className="mt-4 mb-8 flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-500">Dashboard</span>
        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden transition-colors">
          {session.user.image ? <img src={session.user.image} alt="User" /> : <Activity size={18} className="text-zinc-400" />}
        </div>
      </header>

      {/* CARD PRINCIPAL */}
      <section className="relative h-64 w-full overflow-hidden rounded-[2.5rem] mb-10 group border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl transition-all">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-50 group-hover:scale-105 transition-transform duration-700"
          alt="Treino"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent dark:from-black dark:via-black/40" />
        
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-white">Logo</h2>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white leading-tight">Olá, {session.user.name?.split(' ')[0]}</h3>
              <p className="text-zinc-300 dark:text-zinc-400 text-xs font-bold mt-1 uppercase tracking-wider">Bora treinar hoje?</p>
            </div>
            <Link href="/treinos" className="bg-blue-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-blue-500 active:scale-90 transition-all italic text-sm">
              Bora!
            </Link>
          </div>
        </div>
      </section>

      {/* CONSISTÊNCIA */}
      <section className="mb-10 px-1">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-sans">Consistência</h4>
          <button className="text-blue-600 dark:text-blue-500 text-[10px] font-black uppercase tracking-widest">Ver Histórico</button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {diasSemana.map((dia, i) => {
              const treinou = logsRecentas.some((l: any) => new Date(l.completedAt).getDay() === i);
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                    treinou 
                      ? "bg-blue-600 border-blue-400 shadow-md" 
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  }`}>
                    {treinou && <Zap size={12} fill="white" className="text-white" />}
                  </div>
                  <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase">{dia}</span>
                </div>
              );
            })}
          </div>
          
          <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-2xl flex items-center gap-2">
            <Flame size={16} className="text-orange-500" fill="currentColor" />
            <span className="text-lg font-black italic text-orange-500">15</span>
          </div>
        </div>
      </section>

      {/* TREINO DE HOJE */}
      <section className="px-1 mb-20">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-sans">Treino de Hoje</h4>
          <button className="text-blue-600 dark:text-blue-500 text-[10px] font-black uppercase tracking-widest">Ver Treinos</button>
        </div>

        <div className="relative bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-hidden group active:scale-[0.98] transition-all shadow-sm">
          <div className="relative z-10">
            <span className="bg-zinc-200 dark:bg-zinc-800 text-[9px] font-black px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-colors">Sexta</span>
            <div className="mt-4 flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-2xl font-black italic uppercase text-zinc-900 dark:text-white transition-colors">Superiores</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold mt-1 uppercase tracking-widest">45min • 4 exercícios</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Dumbbell size={20} className="text-white" />
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 dark:opacity-20 grayscale pointer-events-none transition-opacity">
             <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200" className="object-cover h-full" alt="" />
          </div>
        </div>
      </section>

    </main>
  );
}