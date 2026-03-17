"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react"; 
import { salvarTreinoAction } from "./actions"; 

export default function NovoTreino() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [nomeTreino, setNomeTreino] = useState("");
  const [loading, setLoading] = useState(false);
  const [exercicios, setExercicios] = useState([
    { id: Date.now(), nome: "", series: "", repeticoes: "" }
  ]);

  const adicionarExercicio = () => {
    setExercicios([...exercicios, { id: Date.now(), nome: "", series: "", repeticoes: "" }]);
  };

  const removerExercicio = (idParaRemover: number) => {
    if (exercicios.length > 1) {
      setExercicios(exercicios.filter(ex => ex.id !== idParaRemover));
    }
  };

  const atualizarExercicio = (id: number, campo: string, valor: string) => {
    setExercicios(exercicios.map(ex => (ex.id === id ? { ...ex, [campo]: valor } : ex)));
  };

  // FUNÇÃO QUE CONECTA COM O BANCO
 const handleSalvar = async () => {
    if (!nomeTreino) return alert("Dê um nome ao seu treino!");
    if (!session?.user) return alert("Você precisa estar logado!");

    setLoading(true);
    try {
      const userId = (session?.user as any)?.id;
      
      const result = await salvarTreinoAction(nomeTreino, exercicios, userId);

      if (result.success) {
        router.refresh(); 
        
        router.push("/treinos");
        
      } else {
        alert("Erro ao salvar o treino: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro crítico ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] max-w-md mx-auto p-6 flex flex-col gap-6 pb-32">
      <header className="flex items-center gap-4 mt-4">
        <button onClick={() => router.back()} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-white tracking-tight">Criar Treino</h1>
      </header>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">Nome da Rotina</label>
        <input
          type="text"
          placeholder="Ex: Treino A - Peito"
          value={nomeTreino}
          onChange={(e) => setNomeTreino(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Lista Exercícios */}
      <div className="flex flex-col gap-4">
        {exercicios.map((ex, index) => (
          <div key={ex.id} className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-4 flex flex-col gap-3 relative">
            <button onClick={() => removerExercicio(ex.id)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500"><Trash2 size={20} /></button>
            <span className="text-xs font-black text-blue-500 bg-blue-500/10 w-fit px-2 py-1 rounded-lg">#{index + 1}</span>
            <input
              type="text"
              placeholder="Qual o exercício?"
              value={ex.nome}
              onChange={(e) => atualizarExercicio(ex.id, "nome", e.target.value)}
              className="w-full bg-transparent border-b border-zinc-800 pb-2 text-lg font-bold text-white focus:border-blue-500 outline-none"
            />
            <div className="flex gap-4">
              <input type="text" placeholder="Séries" value={ex.series} onChange={(e) => atualizarExercicio(ex.id, "series", e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-center text-white" />
              <input type="text" placeholder="Reps" value={ex.repeticoes} onChange={(e) => atualizarExercicio(ex.id, "repeticoes", e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-center text-white" />
            </div>
          </div>
        ))}

        <button onClick={adicionarExercicio} className="w-full border-2 border-dashed border-zinc-800 text-zinc-400 font-bold py-4 rounded-3xl flex items-center justify-center gap-2">
          <Plus size={20} strokeWidth={3} /> Adicionar Exercício
        </button>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="fixed bottom-24 left-0 w-full px-6 flex justify-center">
        <button 
          disabled={loading}
          onClick={handleSalvar}
          className="w-full max-w-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
          {loading ? "Salvando..." : "Salvar Treino"}
        </button>
      </div>
    </main>
  );
}