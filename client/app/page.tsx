import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardStats } from "./actions";
import { redirect } from "next/navigation";
import { Activity, Flame, ChevronRight, Dumbbell } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { totalLogs, ultimosLogs, logsRecentas } = await getDashboardStats((session.user as any).id);

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const hoje = new Date().getDay();

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-40 max-w-md mx-auto">
      <header className="mt-8 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            WORKOUT<span className="text-blue-600">.</span>
          </h1>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Status: Ativo</p>
        </div>
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden">
          {session.user.image ? <img src={session.user.image} alt="Perfil" /> : <Activity size={20} />}
        </div>
      </header>

      {/* MAPA DE CONSISTÊNCIA */}
      <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Consistência 7D</h3>
          <div className="flex items-center gap-1 text-orange-500">
            <Flame size={14} fill="currentColor" />
            <span className="text-xs font-black italic">ON FIRE</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-2">
          {diasSemana.map((dia, i) => {
            const temTreino = logsRecentas.some(l => new Date(l.completedAt).getDay() === i);
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                  temTreino 
                  ? "bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                  : "bg-zinc-950 border-zinc-800"
                }`}>
                  {temTreino && <Dumbbell size={14} className="text-white" />}
                </div>
                <span className={`text-[10px] font-black ${temTreino ? "text-white" : "text-zinc-600"}`}>{dia}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ÚLTIMOS TREINOS COM FOTO */}
      <section className="mb-10">
        <h2 className="text-xl font-black italic uppercase tracking-tight mb-6">Atividade Recente</h2>
        <div className="flex flex-col gap-4">
          {ultimosLogs.map((log) => (
            <div key={log.id} className="relative h-32 w-full overflow-hidden rounded-[2rem] group border border-zinc-800">
              {/* Imagem de Fundo (Placeholder dinâmico) */}
              <img 
                src={`https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop`} 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                alt="Treino"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">Finalizado</p>
                  <h3 className="text-xl font-black italic uppercase text-white">{log.workoutName}</h3>
                  <p className="text-zinc-400 text-[10px] font-bold">
                    {new Date(log.completedAt).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' })}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK ACTION */}
      <div className="fixed bottom-28 left-0 w-full px-6 flex justify-center">
        <Link 
          href="/treinos" 
          className="w-full max-w-md bg-white text-black font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all uppercase italic"
        >
          Iniciar Nova Sessão
        </Link>
      </div>
    </main>
  );
}