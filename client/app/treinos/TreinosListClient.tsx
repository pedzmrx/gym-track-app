"use client";

import { useState } from "react";
import { Plus, ChevronRight, Dumbbell, Activity, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteWorkout } from "@/app/actions";

export default function TreinosListClient({ meusTreinos }: { meusTreinos: any[] }) {
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const [treinos, setTreinos] = useState(meusTreinos);
  const router = useRouter();

  const handleExcluir = async (id: string) => {
    if (confirm("Deseja realmente excluir este treino?")) {
      const res = await deleteWorkout(id);
      if (res.success) {
        setTreinos(treinos.filter((t: any) => t.id !== id));
        setMenuAberto(null);
        router.refresh();
      }
    }
  };

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
        {treinos.length === 0 ? (
          <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-900 rounded-[2.5rem] p-12 text-center flex flex-col items-center gap-4">
            <Activity size={40} className="text-zinc-800" />
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest italic">Nenhum treino encontrado</p>
          </div>
        ) : (
          treinos.map((treino: any) => (
            <div key={treino.id} className="relative">
              <Link 
                href={`/treinos/${treino.id}`} 
                className="relative block bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 overflow-hidden active:scale-[0.98] transition-all hover:border-blue-600/30"
              >
                <div className="relative z-10 pr-10">
                  <span className="bg-zinc-800/50 text-[9px] font-black px-3 py-1 rounded-full text-zinc-400 uppercase tracking-widest mb-4 inline-block">Rotina</span>
                  <h2 className="text-2xl font-black italic uppercase text-zinc-100 leading-tight">{treino.name}</h2>
                  <div className="flex items-center gap-1.5 mt-3 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    <Dumbbell size={14} className="text-blue-600" />
                    <span>{treino.exercises?.length || 0} exercícios</span>
                  </div>
                </div>
              </Link>

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setMenuAberto(menuAberto === treino.id ? null : treino.id);
                }} 
                className="absolute top-8 right-8 z-20 p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <MoreVertical size={20} />
              </button>

              {menuAberto === treino.id && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuAberto(null)} />
                  <div className="absolute top-16 right-6 z-30 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 w-40 animate-in fade-in zoom-in duration-200">
                    <Link 
                      href={`/treinos/${treino.id}/editar`} 
                      className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300"
                    >
                      <Pencil size={14} /> Editar
                    </Link>
                    <button 
                      onClick={() => handleExcluir(treino.id)} 
                      className="flex items-center gap-3 p-3 hover:bg-red-600/20 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 text-left w-full"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}