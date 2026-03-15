import { Flame } from "lucide-react";
import Link from "next/link";

export default function ConsistencyWidget() {
  
  const weekDays = [
    { letter: 'S', done: true },
    { letter: 'T', done: true },
    { letter: 'Q', done: false },
    { letter: 'Q', done: false },
    { letter: 'S', done: false },
    { letter: 'S', done: false },
    { letter: 'D', done: false },
  ];

  return (
    <section className="flex flex-col gap-3 mt-4">
      {/* Cabeçalho do Widget */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-zinc-100">Consistência</h2>
        <Link href="/historico" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
          Ver histórico
        </Link>
      </div>

      {/* Card Principal */}
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-5 flex items-center justify-between backdrop-blur-md">
        
        {/* Mapa da Semana */}
        <div className="flex gap-2">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div 
                className={`w-7 h-7 rounded-lg transition-all duration-300 ${
                  day.done 
                    ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)] scale-105' 
                    : 'bg-zinc-800/30 border border-zinc-700/30'
                }`}
              />
              <span className="text-[10px] font-bold text-zinc-500">{day.letter}</span>
            </div>
          ))}
        </div>

        {/* Linha Divisória Fina */}
        <div className="w-px h-10 bg-zinc-800 mx-1"></div>

        {/* Icone Fire */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-orange-500">
            <Flame size={26} strokeWidth={2} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <span className="text-2xl font-black tracking-tighter">15</span>
          </div>
        </div>

      </div>
    </section>
  );
}