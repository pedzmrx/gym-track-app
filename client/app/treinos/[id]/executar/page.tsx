"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { X, Trophy, Loader2, Weight, Hash, CheckCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { registrarTreinoCompleto, buscarExerciciosAction } from "@/app/actions";

function ExercicioCard({ ex, index, onSerieConcluida }: { ex: any; index: number; onSerieConcluida: (reg: any) => void }) {
  const numSets = parseInt(ex.sets) || 1;
  const [aberto, setAberto] = useState(false);
  const [serieAtual, setSerieAtual] = useState(1);
  const [peso, setPeso] = useState(ex.ultimoPeso || "");
  const [repsReais, setRepsReais] = useState(ex.ultimasReps || ex.reps);
  const [concluido, setConcluido] = useState(false);

  const handleConfirmarSerie = () => {
    if (!peso) return alert("Informe o peso!");
    onSerieConcluida({ exerciseId: ex.id, setNumber: serieAtual, peso, reps: repsReais });
    if (serieAtual < numSets) {
      setSerieAtual(prev => prev + 1);
      setPeso("");
    } else {
      setConcluido(true);
      setAberto(false);
    }
  };

  return (
    <div className={`border rounded-3xl mb-4 overflow-hidden transition-all ${concluido ? "bg-green-600/10 border-green-600/40" : "bg-zinc-900 border-zinc-800"}`}>
      <button onClick={() => !concluido && setAberto(!aberto)} className="w-full p-5 text-left flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${concluido ? "bg-green-600/20 text-green-500" : "bg-zinc-800 text-zinc-500"}`}>{index + 1}</span>
            <h3 className={`font-black italic uppercase text-sm ${concluido ? "text-green-500" : "text-white"}`}>{ex.name}</h3>
          </div>
          <div className="flex gap-2">
            <span className="bg-zinc-800 text-[9px] font-bold px-2 py-1 rounded-full text-zinc-500 uppercase">{numSets} Séries</span>
            <span className="bg-zinc-800 text-[9px] font-bold px-2 py-1 rounded-full text-zinc-500 uppercase">{ex.reps} Reps</span>
          </div>
        </div>
        {concluido ? <CheckCircle className="text-green-500" size={24} /> : aberto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {aberto && (
        <div className="p-5 pt-0 space-y-6 animate-in slide-in-from-top-2">
          <div className="h-px bg-zinc-800 w-full mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
              <span className="text-[9px] font-black text-zinc-500 uppercase mb-2">Peso (kg)</span>
              <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} className="bg-transparent text-3xl font-black text-center w-full outline-none" placeholder="0" />
            </div>
            <div className="bg-zinc-800 p-4 rounded-2xl flex flex-col items-center">
              <span className="text-[9px] font-black text-zinc-500 uppercase mb-2">Reps</span>
              <input type="number" value={repsReais} onChange={(e) => setRepsReais(e.target.value)} className="bg-transparent text-3xl font-black text-blue-500 text-center w-full outline-none" />
            </div>
          </div>
          <button onClick={handleConfirmarSerie} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase italic shadow-lg">
            {serieAtual < numSets ? `Confirmar Série ${serieAtual}` : "Finalizar Exercício"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExecutarTreinoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [nomeTreino, setNomeTreino] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [finalizado, setFinalizado] = useState(false);
  const [proximoTreinoNome, setProximoTreinoNome] = useState("");
  const [logTreino, setLogTreino] = useState<any[]>([]);
  const [concluidosIds, setConcluidosIds] = useState<string[]>([]);

  useEffect(() => {
  async function carregar() {
    try {
      const res = await buscarExerciciosAction(id);
      if (res.success) {
        const lista = res.exercicios || []; 
        setExercicios(lista);
        setNomeTreino(res.nomeTreino || "");
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoadingDados(false);
    }
  }
  carregar();
}, [id]);

  const handleFinalizar = async () => {
    if (!session?.user) return;
    setLoading(true);
    const res = await registrarTreinoCompleto(id, (session.user as any).id, nomeTreino, logTreino);
    if (res.success) {
      setProximoTreinoNome(res.proximoTreino || "");
      setFinalizado(true);
    }
    setLoading(false);
  };

  if (loadingDados) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  if (finalizado) return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <Trophy size={60} className="text-blue-500 mb-6" />
      <h1 className="text-3xl font-black italic uppercase text-white leading-none mb-2">Treino Pago!</h1>
      <p className="text-zinc-500 text-sm mb-8 uppercase font-bold tracking-widest">Amanhã seu treino é: <span className="text-blue-500">{proximoTreinoNome}</span></p>
      <button onClick={() => router.push("/treinos")} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase italic">Voltar ao Início</button>
    </div>
  );

  const prontoParaFinalizar = exercicios.length > 0 && concluidosIds.length === exercicios.length;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-40 max-w-md mx-auto flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-zinc-600"><X size={24} /></button>
        <h2 className="text-xs font-black uppercase italic text-zinc-500 tracking-widest">{nomeTreino}</h2>
      </header>

      <div className="flex-1">
        {exercicios.map((ex, i) => (
          <ExercicioCard key={ex.id} index={i} ex={ex} onSerieConcluida={(reg) => {
            setLogTreino(p => [...p, reg]);
            const numSets = parseInt(ex.sets);
            if (reg.setNumber === numSets) setConcluidosIds(p => [...p, ex.id]);
          }} />
        ))}
      </div>

      <footer className="fixed bottom-32 left-0 right-0 px-6 max-w-md mx-auto z-50">
        <button 
          disabled={!prontoParaFinalizar || loading}
          onClick={handleFinalizar}
          className="w-full bg-green-600 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase italic text-lg shadow-xl disabled:opacity-20 disabled:grayscale transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={22} />}
          {loading ? "Salvando..." : "Concluir Treino"}
        </button>
      </footer>
    </div>
  );
}