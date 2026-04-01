"use client";

import { Plus, ChevronRight, Dumbbell, Activity } from "lucide-react";
import Link from "next/link";

export default function TreinosListClient({ meusTreinos }: { meusTreinos: any[] }) {
  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto relative font-sans">
      
      <header className="mt-4 mb-8 flex justify-between items-center px-1">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block mb-1">Biblioteca</span>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Meus Treinos</h1>
        </div>
        <Link 
          href="/treinos/novo" 
          className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-90 transition-all"
        >
          <Plus size={24} strokeWidth={3} className="text-white" />
        </Link>
      </header>

      <section className="flex flex-col gap-6">
        {meusTreinos.length === 0 ? (
          <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-900 rounded-[2.5rem] p-12 text-center flex flex-col items-center gap-4">
            <Activity size={40} className="text-zinc-800" />
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest italic">Nenhum treino encontrado</p>
          </div>
        ) : (
          meusTreinos.map((treino: any) => (
            <Link 
              key={treino.id}
              href={`/treinos/${treino.id}`} 
              className="relative block bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 overflow-hidden active:scale-[0.98] transition-all hover:border-blue-600/30 group"
            >
              <div className="relative z-10">
                <span className="bg-zinc-800/50 text-[9px] font-black px-3 py-1 rounded-full text-zinc-400 uppercase tracking-widest mb-4 inline-block">Rotina</span>
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <h2 className="text-2xl font-black italic uppercase text-zinc-100 group-hover:text-blue-500 transition-colors leading-tight">
                      {treino.name}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-3 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                      <Dumbbell size={14} className="text-blue-600" />
                      <span>{treino.exercises?.length || 0} exercícios</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Dumbbell size={120} strokeWidth={4} />
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}