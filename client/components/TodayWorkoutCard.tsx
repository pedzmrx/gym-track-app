import { Calendar, Clock, Dumbbell } from "lucide-react";
import Link from "next/link";

export default function TodayWorkoutCard() {
  return (
    <section className="flex flex-col gap-3 mt-4">
      {/* Cabeçalho da Seção */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-zinc-100">Treino de Hoje</h2>
        <Link href="/treinos" className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          Ver treinos
        </Link>
      </div>

      {/* Card Principal */}
      <Link href="/treino/atual" className="relative w-full h-56 rounded-[2rem] overflow-hidden group block shadow-2xl shadow-black/50">
        
        {/* Imagem de Fundo */}
        <img
          src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop"
          alt="Homem treinando"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent"></div>

        {/* Tag do Dia da Semana */}
        <div className="absolute top-5 left-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-700/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <Calendar size={14} className="text-zinc-300" />
          <span className="text-xs font-bold text-zinc-200 tracking-widest uppercase">Sexta</span>
        </div>

        {/* Conteúdo Inferior */}
        <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2">
          <h3 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
            Superiores
          </h3>
          
          <div className="flex items-center gap-4 text-zinc-300 text-sm font-medium">
            <div className="flex items-center gap-1.5 bg-zinc-950/40 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Clock size={16} className="text-blue-500" />
              <span>45min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-950/40 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Dumbbell size={16} className="text-blue-500" />
              <span>4 exercícios</span>
            </div>
          </div>
        </div>

      </Link>
    </section>
  );
}