'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ workouts: 0, exercises: 0 });
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/workouts').then(res => res.json()),
      fetch('/api/exercises').then(res => res.json())
    ]).then(([workouts, exercises]) => {
      setStats({
        workouts: workouts.length,
        exercises: exercises.length
      });
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Bem-vinda de volta! 🔥</h1>
        <p className="text-slate-400">Pronta para esmagar as metas de hoje?</p>
      </header>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl shadow-xl shadow-blue-900/20">
          <span className="text-blue-100 text-sm font-bold uppercase opacity-80">Treinos Montados</span>
          <div className="text-4xl font-black mt-2">{stats.workouts}</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
          <span className="text-slate-400 text-sm font-bold uppercase">Exercícios no Catálogo</span>
          <div className="text-4xl font-black mt-2 text-blue-400">{stats.exercises}</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
          <span className="text-slate-400 text-sm font-bold uppercase">Consistência (Semana)</span>
          <div className="text-4xl font-black mt-2 text-green-400">85%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ACESSO RÁPIDO */}
        <section className="bg-slate-800/20 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Ações Rápidas</h2>
          <div className="flex flex-col gap-4">
            <Link href="/treinos" className="group p-4 bg-slate-900 hover:bg-blue-600 rounded-2xl border border-slate-700 transition-all flex justify-between items-center">
              <div>
                <span className="block font-bold group-hover:text-white">Iniciar um Treino</span>
                <span className="text-xs text-slate-500 group-hover:text-blue-100">Escolha uma ficha e comece agora</span>
              </div>
              <span className="text-2xl">➔</span>
            </Link>
            
            <Link href="/biblioteca" className="group p-4 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-700 transition-all flex justify-between items-center">
              <div>
                <span className="block font-bold">Gerenciar Catálogo</span>
                <span className="text-xs text-slate-500">Adicione ou edite exercícios</span>
              </div>
              <span className="text-2xl opacity-30 group-hover:opacity-100">⚙️</span>
            </Link>
          </div>
        </section>

        {/* ÚLTIMOS TREINOS */}
        <section className="bg-slate-800/20 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Histórico Recente</h2>
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
            <p>Nenhum log registrado ainda.</p>
            <p className="text-xs">Os treinos concluídos aparecerão aqui.</p>
          </div>
        </section>
      </div>
    </div>
  );
}