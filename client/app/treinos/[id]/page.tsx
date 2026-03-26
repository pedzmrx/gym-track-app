"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Play, Dumbbell, Clock, Trash2, MoreVertical, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteWorkout, deleteExercise } from "../../actions";

interface Exercicio {
  id: string;
  name: string;
  sets: string;
  reps: string;
}

interface Treino {
  id: string;
  name: string;
  exercises: Exercicio[];
}

export default function DetalhesTreinoPage() {
  const router = useRouter();
  const params = useParams();
  
  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);

  const carregarTreino = useCallback(async () => {
    if (!params?.id) return;
    
    try {
      const response = await fetch(`/api/treino?id=${params.id}`);
      if (!response.ok) throw new Error("Falha ao buscar treino");
      
      const data = await response.json();
      setTreino(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    carregarTreino();
  }, [carregarTreino]);

  const handleExcluirTreino = async () => {
    if (!confirm("Excluir este treino permanentemente?")) return;
    const res = await deleteWorkout(params.id as string);
    if (res.success) {
      router.push("/treinos");
      router.refresh();
    }
  };

  const handleExcluirExercicio = async (exerciseId: string) => {
    if (!confirm("Remover exercício?")) return;
    const res = await deleteExercise(exerciseId);
    if (res.success) {
      setTreino(prev => prev ? {
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
      } : null);
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!treino) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500 font-bold uppercase italic">Treino não encontrado</p>
        <Link href="/treinos" className="text-blue-500 font-black uppercase text-xs">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto relative">
      {/* Header */}
      <header className="mt-4 mb-10 flex items-center justify-between relative">
        <button 
          onClick={() => router.push("/treinos")} 
          className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-95 transition-all"
          >
            <MoreVertical size={20} className="text-zinc-500" />
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <button 
                onClick={handleExcluirTreino}
                className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-500/10 font-black italic uppercase text-[10px] transition-all"
              >
                <Trash2 size={14} />
                Excluir Treino
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Info Section */}
      <section className="mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 block mb-2">Treino Selecionado</span>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
          {treino.name}
        </h1>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800/50">
            <Dumbbell size={14} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-300">{treino.exercises?.length || 0} Exercícios</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800/50">
            <Clock size={14} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-300">~45 min</span>
          </div>
        </div>
      </section>

      {/* Exercises List */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Ordem de Execução</h3>
        
        {treino.exercises.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-center">
            <p className="text-zinc-700 text-[10px] font-black uppercase italic">Nenhum exercício adicionado</p>
          </div>
        ) : (
          treino.exercises.map((ex, index) => (
            <div 
              key={ex.id} 
              className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-6 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-lg font-black italic text-zinc-600 group-hover:text-blue-500 transition-colors">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-zinc-100 group-hover:text-white transition-colors leading-tight">
                    {ex.name}
                  </h4>
                  <div className="flex gap-3 mt-1 items-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{ex.sets} Séries</span>
                    <span className="text-zinc-800 text-[8px]">●</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{ex.reps} Reps</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleExcluirExercicio(ex.id)}
                className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors active:scale-90"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </section>

      <div className="fixed bottom-32 left-0 right-0 px-6 max-w-md mx-auto z-50">
  <Link 
    href={`/treinos/${treino.id}/executar`}
    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-[0_15px_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-4 transition-all active:scale-95 uppercase italic text-lg"
  >
    <Play size={20} fill="white" />
    Iniciar Treino
  </Link>
</div>
    </div>
  );
}