"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

export default function NovoTreino() {
  const router = useRouter();
  
  // Função para armazenar o nome do treino
  const [nomeTreino, setNomeTreino] = useState("");
  
  const [exercicios, setExercicios] = useState([
    { id: Date.now(), nome: "", series: "", repeticoes: "" }
  ]);

  // Função para adicionar um novo exercício à lista
  const adicionarExercicio = () => {
    setExercicios([
      ...exercicios,
      { id: Date.now(), nome: "", series: "", repeticoes: "" }
    ]);
  };

  // Função para remover um exercício da lista
  const removerExercicio = (idParaRemover: number) => {
    if (exercicios.length > 1) {
      setExercicios(exercicios.filter(ex => ex.id !== idParaRemover));
    }
  };

  // Função para atualizar o texto que o usuário digita
  const atualizarExercicio = (id: number, campo: string, valor: string) => {
    setExercicios(
      exercicios.map(ex => (ex.id === id ? { ...ex, [campo]: valor } : ex))
    );
  };

  return (
    <main className="min-h-[100dvh] max-w-md mx-auto p-6 flex flex-col gap-6 pb-32">
      
      {/* CABEÇALHO COM BOTÃO DE VOLTAR */}
      <header className="flex items-center gap-4 mt-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-white tracking-tight">Criar Treino</h1>
      </header>

      {/* NOME DO TREINO */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">
          Nome da Rotina
        </label>
        <input
          type="text"
          placeholder="Ex: Treino A - Peito e Tríceps"
          value={nomeTreino}
          onChange={(e) => setNomeTreino(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
        />
      </div>

      {/* LISTA DE EXERCÍCIOS */}
      <div className="flex flex-col gap-4 mt-2">
        <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">
          Exercícios
        </label>
        
        {exercicios.map((ex, index) => (
          <div key={ex.id} className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-4 flex flex-col gap-3 relative group">
            
            {/* Botão de Excluir */}
            <button 
              onClick={() => removerExercicio(ex.id)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>

            {/* Número do Exercício */}
            <span className="text-xs font-black text-blue-500 bg-blue-500/10 w-fit px-2 py-1 rounded-lg">
              #{index + 1}
            </span>

            {/* Input Livre do Nome do Exercício */}
            <input
              type="text"
              placeholder="Qual o exercício? (Ex: Supino Reto)"
              value={ex.nome}
              onChange={(e) => atualizarExercicio(ex.id, "nome", e.target.value)}
              className="w-full bg-transparent border-b border-zinc-800 pb-2 text-lg font-bold text-white focus:outline-none focus:border-blue-500 placeholder:text-zinc-700 placeholder:font-medium transition-colors"
            />

            {/* Inputs de Séries e Repetições */}
            <div className="flex gap-4 mt-1">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-500">Séries</span>
                <input
                  type="text"
                  placeholder="Ex: 4"
                  value={ex.series}
                  onChange={(e) => atualizarExercicio(ex.id, "series", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-center"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-500">Repetições</span>
                <input
                  type="text"
                  placeholder="Ex: 10-12"
                  value={ex.repeticoes}
                  onChange={(e) => atualizarExercicio(ex.id, "repeticoes", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-center"
                />
              </div>
            </div>
          </div>
        ))}

        {/* BOTÃO ADICIONAR MAIS EXERCÍCIOS */}
        <button 
          onClick={adicionarExercicio}
          className="w-full border-2 border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 text-zinc-400 font-bold py-4 rounded-3xl flex items-center justify-center gap-2 transition-all mt-2"
        >
          <Plus size={20} strokeWidth={3} />
          Adicionar Exercício
        </button>
      </div>

      {/* BOTÃO FLUTUANTE DE SALVAR */}
      <div className="fixed bottom-24 left-0 w-full px-6 flex justify-center pointer-events-none">
        <button 
          className="w-full max-w-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-600/30 pointer-events-auto"
          onClick={() => console.log({ nomeTreino, exercicios })}
        >
          <Save size={24} />
          Salvar Treino
        </button>
      </div>

    </main>
  );
}