"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Check, Plus, X, Dumbbell, ArrowLeft, Trash2 } from "lucide-react";
import { updateWorkout } from "@/app/actions";
import Link from "next/link";

export default function EditWorkoutForm({ treino }: any) {
  const [nomeTreino, setNomeTreino] = useState(treino.name);
  const [exercicios, setExercicios] = useState<any[]>(treino.exercises);
  const [novoExercicioNome, setNovoExercicioNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const adicionarExercicio = () => {
    if (!novoExercicioNome.trim()) return;
    
    const novo = {
      id: `temp-${Date.now()}`, 
      name: novoExercicioNome.trim(),
      isNew: true
    };
    
    setExercicios([...exercicios, novo]);
    setNovoExercicioNome("");
  };

  const removerExercicio = (id: string) => {
    setExercicios(exercicios.filter(ex => ex.id !== id));
  };

  const handleSalvar = async () => {
    if (!nomeTreino.trim() || exercicios.length === 0) {
      alert("O treino precisa de um nome e pelo menos um exercício.");
      return;
    }
    
    setCarregando(true);
    
    const nomesExercicios = exercicios.map(ex => ex.name);
    const res = await updateWorkout(treino.id, nomeTreino, nomesExercicios);
    
    if (res.success) {
      router.push(`/treinos/${treino.id}`);
      router.refresh();
    } else {
      alert("Erro ao salvar alterações.");
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* NOME DO TREINO */}
      <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-800 shadow-inner">
        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2 block ml-1">Nome do Treino</label>
        <input 
          value={nomeTreino}
          onChange={(e) => setNomeTreino(e.target.value)}
          className="w-full bg-transparent text-2xl font-black italic uppercase text-white outline-none placeholder:text-zinc-800"
          placeholder="Ex: Treino A"
        />
      </div>

      {/* LISTA DE EXERCÍCIOS ATUAIS */}
      <div>
        <h3 className="text-sm font-black uppercase text-zinc-400 mb-4 px-2 tracking-widest flex justify-between items-center">
          <span>Exercícios Planejados</span>
          <span className="text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full text-[10px] font-black">{exercicios.length}</span>
        </h3>
        
        <div className="flex flex-col gap-3">
          {exercicios.map((ex) => (
            <div key={ex.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[1.8rem] flex justify-between items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-blue-500">
                   <Dumbbell size={18} />
                </div>
                <span className="font-bold text-sm uppercase italic text-zinc-200">{ex.name}</span>
              </div>
              <button 
                onClick={() => removerExercicio(ex.id)}
                className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CAMPO PARA ADICIONAR EXERCÍCIO */}
      <div className="bg-zinc-900/30 p-6 rounded-[2.5rem] border border-zinc-800/50">
        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 block ml-1 text-center">Adicionar Novo Exercício</label>
        <div className="flex gap-2">
          <input 
            value={novoExercicioNome}
            onChange={(e) => setNovoExercicioNome(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && adicionarExercicio()}
            placeholder="Digite o nome..."
            className="flex-1 bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-blue-600 transition-all"
          />
          <button 
            onClick={adicionarExercicio}
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="fixed bottom-10 left-0 right-0 px-6 max-w-md mx-auto flex gap-3 z-50">
        <Link href={`/treinos/${treino.id}`} className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white active:scale-90 transition-all">
          <ArrowLeft size={24} />
        </Link>
        <button
          onClick={handleSalvar}
          disabled={carregando}
          className="flex-1 bg-blue-600 h-16 rounded-2xl flex items-center justify-center gap-3 font-black italic uppercase text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95 transition-all disabled:opacity-50"
        >
          {carregando ? "Salvando..." : <><Check size={20} strokeWidth={3} /> Salvar Alterações</>}
        </button>
      </div>
    </div>
  );
}