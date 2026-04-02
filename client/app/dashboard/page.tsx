"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Flame, Calendar, Trophy, Activity, ArrowUpRight } from "lucide-react";
import { getEvolutionData, getDashboardStats, getPersonalRecords } from "@/app/actions";
import Link from "next/link";

export default function EvolucaoPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [evolution, setEvolution] = useState<any>(null);
  const [records, setRecords] = useState<any>(null);
  const [ultimosLogs, setUltimosLogs] = useState<any[]>([]);
  
  const [filtro, setFiltro] = useState<"mensal" | "anual">("mensal");

  useEffect(() => {
    async function carregarDados() {
      if (!session?.user) return;
      const userId = (session.user as any).id;

      try {
        const [resEvo, resDash, resRec] = await Promise.all([
          getEvolutionData(userId),
          getDashboardStats(userId),
          getPersonalRecords(userId)
        ]);

        if (resEvo.success) setEvolution(resEvo);
        if (resRec.success) setRecords(resRec);
        if (resDash.logsRecentas) setUltimosLogs(resDash.logsRecentas);
      } catch (error) {
        console.error("Erro ao carregar evolução:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [session]);

  const gerarCalendarioMensal = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  
  const primeiroDia = new Date(ano, mes, 1);
  const diaSemanaInicio = primeiroDia.getDay();
  const dias = [];

  for (let i = 0; i < diaSemanaInicio; i++) {
    dias.push({ day: '', dateStr: '', currentMonth: false });
  }

  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  for (let i = 1; i <= ultimoDia; i++) {
    const diaStr = String(i).padStart(2, '0');
    const mesStr = String(mes + 1).padStart(2, '0');
    const dataFormatada = `${ano}-${mesStr}-${diaStr}`;
    
    dias.push({ day: i, dateStr: dataFormatada, currentMonth: true });
  }
  return dias;
};

  const gerarHeatmapAnual = () => {
    const hoje = new Date();
    const dias = [];
    for (let i = 139; i >= 0; i--) {
      const d = new Date();
      d.setDate(hoje.getDate() - i);
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const str = `${d.getFullYear()}-${mes}-${dia}`;
      
      dias.push({
        day: d.getDate(),
        dateStr: str,
        currentMonth: true
      });
    }
    return dias;
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 max-w-md mx-auto font-sans">
      
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-black uppercase tracking-tighter opacity-50 italic">Evolução</h1>
        <div className="w-8 h-8 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center text-[10px] font-bold">
          {session?.user?.name?.charAt(0)}
        </div>
      </header>

      <section className="relative w-full rounded-[2.5rem] p-8 mb-10 overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(220,38,38,0.25)]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-600 to-red-900" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-5 border border-white/30 shadow-inner">
            <Flame size={36} className="text-white fill-white animate-pulse" />
          </div>
          <h2 className="text-6xl font-black italic uppercase leading-none mb-1 tracking-tighter text-white drop-shadow-md">
            {evolution?.streakAtual || 0} dias
          </h2>
          <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.4em] mb-8 drop-shadow-sm">
            Sequência Atual
          </p>
          <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex items-center gap-3 shadow-xl">
             <Trophy size={14} className="text-orange-400" />
             <p className="text-[10px] font-black uppercase italic tracking-widest text-white">
               RECORDE: {evolution?.recordeStreak || evolution?.streakAtual || 0} DIAS
             </p>
          </div>
        </div>
      </section>

      <section className="mb-10 px-1">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-sm font-black uppercase italic text-zinc-100 tracking-tight">Consistência</h3>
          
          <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-zinc-800">
            <button 
              onClick={() => setFiltro("mensal")}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filtro === "mensal" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "text-zinc-500"}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setFiltro("anual")}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filtro === "anual" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "text-zinc-500"}`}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-[2.5rem] shadow-inner">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, i) => (
              <span key={i} className="text-[10px] font-black text-zinc-600 uppercase italic">{dia}</span>
            ))}
          </div>

          <div className={`grid gap-2 ${filtro === "mensal" ? "grid-cols-7" : "grid-flow-col grid-rows-7 overflow-x-auto custom-scrollbar pb-2"}`}>
            {(filtro === "mensal" ? gerarCalendarioMensal() : gerarHeatmapAnual()).map((item: any, i: number) => {
              
            
              const treinou = evolution?.datasTreino?.some((dataBanco: string) => {
                const d = new Date(dataBanco);
                const dataLocalStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
                  .toISOString()
                  .split("T")[0];
                return dataLocalStr === item.dateStr;
              });

              const hoje = new Date().toLocaleDateString('en-CA') === item.dateStr;

              return (
                <div 
                  key={i} 
                  className={`relative aspect-square rounded-xl flex items-center justify-center border transition-all duration-300
                    ${item.currentMonth ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    ${treinou 
                      ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white font-black' 
                      : 'bg-zinc-800/40 border-zinc-800 text-zinc-500 font-bold'
                    }
                    ${hoje && !treinou ? 'border-zinc-400 ring-1 ring-zinc-500' : ''}
                    ${hoje && treinou ? 'ring-2 ring-blue-400' : ''}
                    ${filtro === "anual" ? "w-4 h-4" : "w-full"}
                  `}
                >
                  {filtro === "mensal" && <span className="text-[10px]">{item.day}</span>}
                  
                  {treinou && filtro === "mensal" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                       <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
             <Activity size={18} className="text-blue-500" />
          </div>
          <span className="text-2xl font-black italic leading-none mb-1 tracking-tighter">{evolution?.totalTreinos || 0}</span>
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Treinos Feitos</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
             <Trophy size={18} className="text-yellow-500" />
          </div>
          <span className="text-2xl font-black italic leading-none mb-1 tracking-tighter">
            {records?.maiorPeso || 0}<span className="text-[10px] ml-1">KG</span>
          </span>
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Maior Carga</span>
        </div>
      </div>

      <section>
        <h3 className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.4em] mb-4 px-2">Atividade Recente</h3>
        <div className="flex flex-col gap-3">
          {ultimosLogs.slice(0, 3).map((log) => (
            <Link 
              key={log.id} 
              href={`/historico/${log.id}`}
              className="bg-zinc-900/20 border border-zinc-800/50 p-5 rounded-2xl flex items-center justify-between group active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-xs text-zinc-200 leading-none mb-1">{log.workoutName}</h4>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                    {new Date(log.completedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-black text-zinc-600 group-hover:text-blue-500 transition-colors uppercase italic">Detalhes</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}