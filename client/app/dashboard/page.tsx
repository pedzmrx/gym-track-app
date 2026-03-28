"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { TrendingUp, Calendar, Trophy, Loader2, ArrowUpRight, Activity } from "lucide-react";
import { getVolumeStats, getDashboardStats, getPersonalRecords } from "@/app/actions";

export default function DashboardEvolucao() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ dia: string; volume: number }[]>([]);
  const [ultimosTreinos, setUltimosTreinos] = useState<any[]>([]);
  const [records, setRecords] = useState<{ maiorPeso: string; nomeExercicio: string; volumeTotal: number } | null>(null);

  useEffect(() => {
    async function carregarDados() {
      if (!session?.user) return;
      const userId = (session.user as any).id;
      
      const [resVolume, resGeral, resRecords] = await Promise.all([
        getVolumeStats(userId),
        getDashboardStats(userId),
        getPersonalRecords(userId)
      ]);

      if (resVolume.success) setStats(resVolume.stats);
      if (resRecords.success) setRecords(resRecords as any);
      setUltimosTreinos(resGeral.ultimosLogs || []);
      setLoading(false);
    }
    carregarDados();
  }, [session]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  const maiorVolume = Math.max(...stats.map(s => s.volume), 1);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 max-w-md mx-auto">
      {/* Header */}
      <header className="mb-8 mt-4">
        <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em]">Performance Hub</span>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Evolução</h1>
      </header>

      {/* Gráfico de Volume Semanal */}
      <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black uppercase italic text-zinc-400">Volume Semanal</h3>
            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Peso x Repetições</p>
          </div>
          <TrendingUp className="text-blue-500" size={20} />
        </div>

        <div className="flex items-end justify-between h-32 gap-2">
          {stats.length === 0 ? (
            <p className="text-zinc-800 text-[10px] font-black uppercase italic w-full text-center">Nenhum dado esta semana</p>
          ) : (
            stats.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-600 rounded-t-lg transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  style={{ height: `${(s.volume / maiorVolume) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[9px] font-black uppercase text-zinc-600 italic">{s.dia}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Cards de Destaque */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl">
          <Activity className="text-blue-500 mb-3" size={18} />
          <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">Volume (7 dias)</span>
          <span className="text-xl font-black italic">
            {records?.volumeTotal.toLocaleString('pt-BR')} <span className="text-[10px] text-zinc-600">KG</span>
          </span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden group">
          <Trophy className="text-yellow-500 mb-3" size={18} />
          <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest truncate">
            PR: {records?.nomeExercicio || "---"}
          </span>
          <span className="text-xl font-black italic">
            {records?.maiorPeso || "0"} <span className="text-[10px] text-zinc-600">KG</span>
          </span>
          <div className="absolute -right-2 -top-2 w-12 h-12 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all" />
        </div>
      </div>

      {/* Histórico Recente */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em]">Atividade Recente</h3>
          <Calendar size={14} className="text-zinc-800" />
        </div>

        <div className="space-y-3">
          {ultimosTreinos.map((log) => (
            <Link 
              key={log.id} 
              href={`/historico/${log.id}`}
              className="block bg-zinc-900/20 border border-zinc-800/50 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-xs text-zinc-200">{log.workoutName}</h4>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                    {new Date(log.completedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-zinc-400 italic group-hover:text-blue-500 transition-colors">VER CARGAS</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}