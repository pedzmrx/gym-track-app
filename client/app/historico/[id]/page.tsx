"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, Weight, Hash, Zap } from "lucide-react";
import { getLogDetalhes } from "@/app/actions";

export default function DetalhesHistoricoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const res = await getLogDetalhes(id);
      if (res.success) setLog(res.log);
      setLoading(false);
    }
    carregar();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <header className="mb-10 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">{log?.workoutName}</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase">
            <Calendar size={12} />
            {new Date(log?.completedAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </header>

      <div className="space-y-4 pb-32">
        {log?.entries.map((entry: any, index: number) => (
          <div key={index} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <h4 className="font-black italic uppercase text-sm text-zinc-200">{entry.exercise.name}</h4>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Série {entry.setNumber}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-zinc-600 uppercase">Peso</span>
                <span className="font-black text-lg italic">{entry.weight}kg</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-zinc-600 uppercase">Reps</span>
                <span className="font-black text-lg italic text-blue-500">{entry.reps}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}