"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, X, Trophy, Loader2, Dumbbell, Circle, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { registrarLogAction, buscarExerciciosAction } from "./actions";

export default function ExecutarTreino({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [concluidos, setConcluidos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [finalizado, setFinalizado] = useState(false);

  // BUSCA REAL DOS EXERCÍCIOS
  useEffect(() => {
    async function carregar() {
      const res = await buscarExerciciosAction(id);
      if (res.success) setExercicios(res.exercicios || []);
      setLoadingDados(false);
    }
    carregar();
  }, [id]);

  const toggleExercicio = (idEx: string) => {
    setConcluidos(prev => 
      prev.includes(idEx) ? prev.filter(i => i !== idEx) : [...prev, idEx]
    );
  };

  const handleFinalizar = async () => {
    if (!session?.user) return;
    setLoading(true);
    const result = await registrarLogAction(id, (session.user as any).id);
    if (result.success) setFinalizado(true);
    setLoading(false);
  };

  if (finalizado) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-center max-w-md mx-auto">
        <Trophy size={64} className="text-yellow-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Treino Encerrado!</h1>
        <p className="text-zinc-500 mb-10 font-medium">Seu treino foi registrado com sucesso.</p>
        <button onClick={() => router.push("/treinos")} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase italic">Voltar ao Início</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 pb-44 max-w-md mx-auto relative">
      <header className="flex justify-between items-center mb-10 mt-4">
        <button onClick={() => router.back()} className="p-2 bg-zinc-900 rounded-full text-zinc-500"><X size={24} /></button>
        <h2 className="text-white font-black italic uppercase tracking-tighter">Em Execução</h2>
        <div className="w-10" />
      </header>

      <div className="flex flex-col gap-4">
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Lista de Exercícios</p>
        
        {loadingDados ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-zinc-700" size={32} /></div>
        ) : exercicios.length === 0 ? (
          <p className="text-zinc-600 italic text-center p-10">Nenhum exercício neste treino.</p>
        ) : (
          exercicios.map((ex) => (
            <button 
              key={ex.id}
              onClick={() => toggleExercicio(ex.id)}
              className={`w-full p-6 rounded-[2.5rem] border transition-all duration-300 flex items-center justify-between ${
                concluidos.includes(ex.id) 
                ? "bg-green-500/10 border-green-500/40 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]" 
                : "bg-zinc-900/40 border-zinc-800/60 text-zinc-500"
              }`}
            >
              <div className="flex flex-col items-start gap-1 text-left">
                <span className="font-bold text-lg text-zinc-100">{ex.name}</span>
                <span className="text-xs font-black uppercase text-zinc-600 tracking-widest">
                  {ex.sets} Séries • {ex.reps} Reps
                </span>
              </div>
              {concluidos.includes(ex.id) ? <CheckCircle size={28} /> : <Circle size={28} className="opacity-20" />}
            </button>
          ))
        )}
      </div>

      <div className="fixed bottom-32 left-0 w-full px-6 flex justify-center pointer-events-none">
        <button 
          disabled={loading || exercicios.length === 0}
          onClick={handleFinalizar}
          className="w-full max-w-md bg-blue-600 text-white font-black text-xl py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(37,99,235,0.3)] disabled:opacity-50 uppercase italic pointer-events-auto active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
          {loading ? "Salvando Treino..." : "Concluir Treino"}
        </button>
      </div>
    </main>
  );
}