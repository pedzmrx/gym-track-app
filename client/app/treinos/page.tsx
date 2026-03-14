'use client';
import { useEffect, useState } from 'react';

export default function TreinosPage() {
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [resEx, resWork] = await Promise.all([
        fetch('/api/exercises'),
        fetch('/api/workouts')
      ]);
      const exercisesData = await resEx.json();
      const workoutsData = await resWork.json();
      
      setExercises(exercisesData);
      setWorkouts(workoutsData);

      if (selectedWorkout) {
        const updated = workoutsData.find((w: any) => w.id === selectedWorkout.id);
        if (updated) setSelectedWorkout(updated);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createWorkout = async () => {
    if (!newWorkoutTitle.trim()) return;

    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: newWorkoutTitle, 
        userId: "user-padrao-teste" 
      }),
    });

    if (response.ok) {
      setNewWorkoutTitle('');
      await fetchData(); 
    }
  };

  const addExerciseToWorkout = async (exercise: any) => {
    if (!selectedWorkout) {
      alert("Selecione um treino na lista da esquerda primeiro!");
      return;
    }

    const response = await fetch('/api/workout-exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: exercise.name, 
        order: selectedWorkout.exercises?.length || 0,
        workoutId: selectedWorkout.id,
        exerciseId: exercise.id
      }),
    });

    if (response.ok) {
      await fetchData(); 
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
      
      {/* COLUNA 1: SELETOR DE TREINOS */}
      <aside className="lg:col-span-3 bg-slate-800/20 border border-slate-800 rounded-3xl p-5 flex flex-col shadow-xl">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📂 Meus Treinos</h2>
        <div className="flex gap-2 mb-6">
          <input 
            value={newWorkoutTitle} 
            onChange={e => setNewWorkoutTitle(e.target.value)} 
            placeholder="Ex: Treino A..." 
            className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex-1 text-sm outline-none focus:border-blue-500 transition-all" 
          />
          <button 
            onClick={createWorkout} 
            className="bg-blue-600 hover:bg-blue-500 px-4 rounded-xl font-bold transition-transform active:scale-95"
          >
            +
          </button>    
        </div>
        
        <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {workouts.map((w: any) => (
            <button 
              key={w.id} 
              onClick={() => setSelectedWorkout(w)} 
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                selectedWorkout?.id === w.id 
                ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40 translate-x-1' 
                : 'bg-slate-800/40 border-transparent hover:border-slate-600 hover:bg-slate-800/60'
              }`}
            >
              <span className="font-semibold block text-slate-100">{w.title}</span>
              <span className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">
                {w.exercises?.length || 0} exercícios adicionados
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* COLUNA 2: EXERCÍCIOS NO TREINO SELECIONADO */}
      <section className="lg:col-span-5 bg-slate-800/40 border border-slate-700 rounded-3xl p-6 shadow-inner flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-blue-400 border-b border-slate-700 pb-4">
          {selectedWorkout ? selectedWorkout.title : 'Selecione um treino'}
        </h2>
        
        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
          {selectedWorkout?.exercises?.map((we: any, index: number) => (
            <div key={we.id} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/50 flex justify-between items-center group animate-in slide-in-from-right-4 duration-300">
              <div>
                <span className="block font-bold text-slate-200">{we.name}</span>
                <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
                  {we.exercise?.muscleGroup || 'Geral'}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-slate-800 px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}

          {selectedWorkout && (!selectedWorkout.exercises || selectedWorkout.exercises.length === 0) && (
            <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
              Nenhum exercício neste treino.<br/>Adicione clicando na lista ao lado!
            </div>
          )}
        </div>
      </section>

      {/* COLUNA 3: BIBLIOTECA RÁPIDA */}
      <aside className="lg:col-span-4 bg-slate-800/20 border border-slate-800 rounded-3xl p-5 flex flex-col">
        <h2 className="text-lg font-bold mb-4">＋ Biblioteca</h2>
        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
          {exercises.map((ex: any) => (
            <div key={ex.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-blue-500/50 transition-colors">
              <span className="text-sm font-medium text-slate-300">{ex.name}</span>
              <button 
                onClick={() => addExerciseToWorkout(ex)} 
                className="bg-slate-800 hover:bg-blue-600 text-[10px] px-3 py-1.5 rounded-lg transition-colors font-black uppercase tracking-tighter"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}