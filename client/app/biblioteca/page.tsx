'use client';
import { useEffect, useState } from 'react';

export default function BibliotecaPage() {
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');

  const fetchExercises = () => {
    fetch('/api/exercises')
      .then(res => res.json())
      .then(setExercises)
      .catch(err => console.error("Erro ao buscar exercícios:", err));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !muscleGroup) return;

    await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, muscleGroup }),
    });

    setName('');
    setMuscleGroup('');
    fetchExercises();
  };

  const deleteExercise = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este exercício?")) return;

    await fetch(`/api/exercises/${id}`, {
      method: 'DELETE',
    });
    
    fetchExercises();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white">Biblioteca de Exercícios</h1>
        <p className="text-slate-400">Gerencie o catálogo global de movimentos.</p>
      </header>

      {/* FORMULÁRIO DE CADASTRO */}
      <form onSubmit={handleSubmit} className="mb-12 p-6 bg-slate-800/40 border border-slate-700 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-2xl">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Nome do Exercício</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Ex: Agachamento Búlgaro" 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all text-slate-200" 
          />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Grupo Muscular</label>
          <input 
            value={muscleGroup} 
            onChange={e => setMuscleGroup(e.target.value)} 
            placeholder="Ex: Pernas" 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all text-slate-200" 
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 w-full md:w-auto">
          Adicionar
        </button>
      </form>

      {/* LISTAGEM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exercises.map((ex: any) => (
          <div key={ex.id} className="p-5 bg-slate-800/20 border border-slate-700/50 rounded-2xl flex justify-between items-center group hover:bg-slate-800/40 transition-all">
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{ex.name}</h3>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{ex.muscleGroup}</span>
            </div>
            
            <button 
              onClick={() => deleteExercise(ex.id)}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        ))}

        {exercises.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500">A biblioteca está vazia. Comece adicionando um exercício acima!</p>
          </div>
        )}
      </div>
    </div>
  );
}