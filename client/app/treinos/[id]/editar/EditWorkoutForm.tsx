"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Check, Plus, X, Dumbbell, ArrowLeft } from "lucide-react";
import { updateWorkout } from "@/app/actions";
import Link from "next/link";

export default function EditWorkoutForm({ treino }: any) {
  const [nomeTreino, setNomeTreino] = useState(treino.name);
  const [exercicios, setExercicios] = useState<any[]>(treino.exercises.map((ex: any) => ({
    id: ex.id,
    name: ex.name,
    sets: ex.sets || "0",
    reps: ex.reps || "0"
  })));
  const [novoExercicioNome, setNovoExercicioNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const adicionarExercicio = () => {
    if (!novoExercicioNome.trim()) return;
    const novo = { 
      id: `temp-${Date.now()}`, 
      name: novoExercicioNome.trim(),
      sets: "3", 
      reps: "12" 
    };
    setExercicios([...exercicios, novo]);
    setNovoExercicioNome("");
  };

  const removerExercicio = (id: string) => {
    setExercicios(exercicios.filter(ex => ex.id !== id));
  };

  const updateExercicioField = (id: string, field: "sets" | "reps", value: string) => {
    setExercicios(exercicios.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSalvar = async () => {
    if (!nomeTreino.trim() || exercicios.length === 0) {
      alert("O treino precisa de um nome e pelo menos um exercício.");
      return;
    }

    setCarregando(true);
    
    try {
      const dadosExercicios = exercicios.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps
      }));

      const res = await updateWorkout(treino.id, nomeTreino, dadosExercicios);
      
      if (res.success) {
        router.refresh(); 
        router.push(`/treinos/${treino.id}`);
      } else {
        alert("Erro ao salvar alterações.");
        setCarregando(false);
      }
    } catch (error) {
      console.error(error);
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-8 pb-72">
      <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-800 shadow-inner">
        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2 block ml-1">Identificação do Treino</label>
        <input 
          value={nomeTreino}
          onChange={(e) => setNomeTreino(e.target.value)}
          className="w-full bg-transparent text-2xl font-black italic uppercase text-white outline-none placeholder:text-zinc-800"
          placeholder="Ex: Treino A"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase text-zinc-400 px-2 tracking-widest flex justify-between items-center">
          <span>Configurar Exercícios</span>
          <span className="text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full text-[10px] font-black">{exercicios.length}</span>
        </h3>
        
        <div className="flex flex-col gap-4">
          {exercicios.map((ex) => (
            <div key={ex.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col gap-4 animate-in fade-in transition-all hover:border-zinc-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Dumbbell size={18} className="text-blue-500" />
                  <span className="font-black text-sm uppercase italic text-zinc-100 leading-tight">{ex.name}</span>
                </div>
                <button onClick={() => removerExercicio(ex.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 border border-zinc-800 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase text-zinc-500 mb-1">Séries</span>
                  <input 
                    type="text"
                    value={ex.sets}
                    onChange={(e) => updateExercicioField(ex.id, "sets", e.target.value)}
                    className="bg-transparent w-full text-center text-lg font-black italic text-white outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="bg-black/40 border border-zinc-800 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase text-zinc-500 mb-1">Reps</span>
                  <input 
                    type="text"
                    value={ex.reps}
                    onChange={(e) => updateExercicioField(ex.id, "reps", e.target.value)}
                    className="bg-transparent w-full text-center text-lg font-black italic text-white outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/30 p-6 rounded-[2.5rem] border border-zinc-800/50">
        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 block ml-1 text-center">Adicionar Novo</label>
        <div className="flex gap-2">
          <input 
            value={novoExercicioNome}
            onChange={(e) => setNovoExercicioNome(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && adicionarExercicio()}
            placeholder="Nome do exercício..."
            className="flex-1 bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-blue-600 transition-all"
          />
          <button onClick={adicionarExercicio} className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="fixed bottom-12 left-0 right-0 px-6 max-w-md mx-auto flex gap-3 z-[100] pt-10 pb-4">
        <Link href={`/treinos/${treino.id}`} className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white active:scale-90 transition-all shadow-2xl">
          <ArrowLeft size={24} />
        </Link>
        <button
          onClick={handleSalvar}
          disabled={carregando}
          className="flex-1 bg-blue-600 h-16 rounded-2xl flex items-center justify-center gap-3 font-black italic uppercase text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] active:scale-95 transition-all disabled:opacity-50"
        >
          {carregando ? "Salvando..." : <><Check size={20} strokeWidth={3} /> Salvar Tudo</>}
        </button>
      </div>
    </div>
  );
}