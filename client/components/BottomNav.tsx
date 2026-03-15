import Link from "next/link";
import { Home, Calendar, Dumbbell, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      
      <nav className="w-full max-w-md bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-800 px-8 pt-4 pb-8 flex justify-between items-center pointer-events-auto">
        
        {/* Botão Ativo (Azul) */}
        <Link href="/" className="flex flex-col items-center gap-1 text-blue-500 transition-colors">
          <Home size={24} strokeWidth={2.5} />
          <span className="text-[10px] font-bold">Início</span>
        </Link>
        
        {/* Botões Inativos (Cinza) */}
        <Link href="/treinos" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Calendar size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium">Treinos</span>
        </Link>

        {/* Botão de Exercícios (Substituindo a IA) */}
        <Link href="/exercicios" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Dumbbell size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium">Exercícios</span>
        </Link>

        <Link href="/perfil" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors">
          <User size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>

      </nav>
    </div>
  );
}