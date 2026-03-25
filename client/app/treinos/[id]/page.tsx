"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Play, Dumbbell, Clock, Trash2, MoreVertical, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  
  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
  async function carregarTreino() {
    try {
      if (!params.id) {
        console.error("❌ Erro: params.id não definido!");
        return;
      }

      console.log(`📡 Buscando dados para o treino ID: ${params.id}...`);
      
      const response = await fetch(`/api/treinos/detalhes/${params.id}`);
      
      console.log(`📊 Status da Resposta API: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.error("❌ Erro 404: Treino não encontrado na API.");
        } else if (response.status === 401) {
          console.error("❌ Erro 401: Não autorizado (Sessão inválida?).");
        } else {
          console.error(`❌ Erro ${response.status}: Falha desconhecida.`);
        }
        throw new Error("Falha na requisição");
      }

      const data = await response.json();
      console.log("✅ Dados recebidos com sucesso:", data);
      setTreino(data);

    } catch (error) {
      console.error("💥 Erro no catch do useEffect:", error);
    } finally {
      setLoading(false);
    }
  }
  carregarTreino();
}, [params.id]);

  const handleExcluirTreino = async () => {
    if (!confirm("Tem certeza que deseja excluir este treino inteiro?")) return;
    if (!params.id) return;

    const res = await deleteWorkout(params.id as string);
    if (res.success) {
      router.push("/treinos");
      router.refresh();
    } else {
      alert("Erro ao excluir o treino.");
    }
  };

  const handleExcluirExercicio = async (exerciseId: string) => {
    if (!confirm("Remover este exercício?")) return;
    const res = await deleteExercise(exerciseId);
    if (res.success) {
      setTreino(prev => prev ? {
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
      } : null);
    } else {
      alert("Erro ao excluir o exercício.");
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
        <p className="text-zinc-500 font-bold italic uppercase">Treino não encontrado</p>
        <Link href="/treinos" className="text-blue-500 font-black uppercase text-sm">Voltar</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto relative overflow-x-hidden">
      
      {/* Header */}
      <header className="mt-4 mb-10 flex items-center justify-between px-1 relative">
        <Link href="/treinos" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-90 transition-all"
          >
            <MoreVertical size={20} className="text-zinc-500" />
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={handleExcluirTreino}
                className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-500/10 font-black italic uppercase text-xs transition-all"
              >
                <Trash2 size={16} />
                Excluir Treino
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Título e Stats */}
      <section className="mb-10 px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 block mb-2">Treino Selecionado</span>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
          {treino.name}
        </h1>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800/50">
            <Dumbbell size={14} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-300">
              {treino.exercises?.length || 0} Exercícios
            </span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800/50">
            <Clock size={14} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-300">~45 min</span>
          </div>
        </div>
      </section>

      {/* Lista de Exercícios */}
      <section className="space-y-4 mb-12">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-1 mb-4">Ordem de Execução</h3>
        
        {treino.exercises.map((ex, index) => (
          <div 
            key={ex.id} 
            className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-6 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-lg font-black italic text-zinc-600 group-hover:text-blue-500 transition-colors">
                {index + 1}
              </div>
              <div>
                <h4 className="font-black italic uppercase text-zinc-100 group-hover:text-white transition-colors">
                  {ex.name}
                </h4>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {ex.sets} Séries
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {ex.reps} Reps
                  </span>
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
        ))}
      </section>

      {/* Botão de Iniciar */}
      <div className="fixed bottom-28 left-0 right-0 px-6 max-w-md mx-auto">
        <Link 
          href={`/treinos/${treino.id}/executar`}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2.5rem] shadow-[0_20px_40px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 transition-all active:scale-95 uppercase italic text-lg tracking-tighter"
        >
          <Play size={24} fill="white" />
          Iniciar Treino
        </Link>
      </div>

    </main>
  );
}