"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { createWorkout } from "../../actions";
import { useSession } from "next-auth/react";

interface ExercicioInput {
  nome: string;
  series: number;
  repeticoes: string;
}

export default function NovoTreinoPage() {
  const router = useRouter();
  const { data: session } = useSession(); 
  
  const [nomeTreino, setNomeTreino] = useState("");
  const [isSalvando, setIsSalvando] = useState(false);
  const [exercicios, setExercicios] = useState<ExercicioInput[]>([
    { nome: "", series: 3, repeticoes: "12" }
  ]);

  const adicionarExercicio = () => {
    setExercicios([...exercicios, { nome: "", series: 3, repeticoes: "12" }]);
  };

  const removerExercicio = (index: number) => {
    if (exercicios.length === 1) return; 
    const novos = exercicios.filter((_, i) => i !== index);
    setExercicios(novos);
  };

  const atualizarExercicio = (index: number, campo: keyof ExercicioInput, valor: string | number) => {
    const novos = [...exercicios];
    novos[index] = { ...novos[index], [campo]: valor } as ExercicioInput;
    setExercicios(novos);
  };

  const salvarTreino = async () => {
    if (!session?.user) return alert("Você precisa estar logado!");
    if (!nomeTreino) return alert("Dê um nome ao seu treino!");
    if (exercicios.some(ex => !ex.nome)) return alert("Preencha o nome de todos os exercícios!");

    setIsSalvando(true);
    
    try {
      const result = await createWorkout(
        (session.user as any).id, 
        nomeTreino, 
        exercicios
      );

      if (result.success) {
        router.push("/treinos");
        router.refresh(); 
      } else {
        alert("Erro ao salvar treino.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto relative">
      
      {/* Header */}
      <header className="mt-4 mb-10 flex items-center justify-between">
        <Link href="/treinos" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">Novo Treino</h1>
        <div className="w-10" />
      </header>

      {/* Nome do Treino */}
      <section className="mb-10">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3 block px-1">Nome do Treino</label>
        <input 
          type="text" 
          placeholder="EX: TREINO A - PEITO"
          value={nomeTreino}
          onChange={(e) => setNomeTreino(e.target.value.toUpperCase())}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 text-lg font-black italic uppercase placeholder:text-zinc-700 focus:border-blue-600 focus:outline-none transition-all"
        />
      </section>

      {/* Exercícios */}
      <section className="space-y-6 mb-10">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Exercícios</label>
          <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase">{exercicios.length} total</span>
        </div>

        {exercicios.map((ex, index) => (
          <div key={index} className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6 relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button 
              onClick={() => removerExercicio(index)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-500 border border-zinc-700 transition-colors"
            >
              <Trash2 size={14} />
            </button>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="NOME DO EXERCÍCIO"
                value={ex.nome}
                onChange={(e) => atualizarExercicio(index, "nome", e.target.value.toUpperCase())}
                className="w-full bg-transparent border-b border-zinc-800 py-2 font-black italic uppercase placeholder:text-zinc-800 focus:border-blue-600 focus:outline-none transition-all"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Séries</span>
                  <input 
                    type="number" 
                    value={ex.series}
                    onChange={(e) => atualizarExercicio(index, "series", parseInt(e.target.value) || 0)}
                    className="bg-transparent font-black text-blue-500 focus:outline-none"
                  />
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Repetições</span>
                  <input 
                    type="text" 
                    value={ex.repeticoes}
                    onChange={(e) => atualizarExercicio(index, "repeticoes", e.target.value)}
                    className="bg-transparent font-black text-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={adicionarExercicio}
          className="w-full border-2 border-dashed border-zinc-800 rounded-[2rem] py-6 flex items-center justify-center gap-2 text-zinc-500 font-black italic uppercase text-sm hover:border-zinc-600 hover:text-zinc-400 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Adicionar Exercício
        </button>
      </section>

      {/* Botão Salvar */}
      <div className="fixed bottom-28 left-0 right-0 px-6 max-w-md mx-auto">
        <button 
          onClick={salvarTreino}
          disabled={isSalvando}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-5 rounded-[2rem] shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 transition-all active:scale-95 uppercase italic tracking-tighter"
        >
          {isSalvando ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} strokeWidth={3} />
              Salvar Treino Completo
            </>
          )}
        </button>
      </div>

    </main>
  );
}