"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Home, Calendar, Dumbbell, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      
      <nav className="w-full max-w-md bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-8 pt-4 pb-10 flex justify-between items-center pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Início */}
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive('/') ? 'opacity-100' : 'opacity-50'}`}>Início</span>
        </Link>
        
        {/* Meus Treinos (Listagem) */}
        <Link 
          href="/treinos" 
          className={`flex flex-col items-center gap-1 transition-all ${isActive('/treinos') ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
          <Calendar size={24} strokeWidth={isActive('/treinos') ? 2.5 : 2} />
          <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive('/treinos') ? 'opacity-100' : 'opacity-50'}`}>Treinos</span>
        </Link>

        {/* Exercícios (Biblioteca) */}
        <Link 
          href="/exercicios" 
          className={`flex flex-col items-center gap-1 transition-all ${isActive('/exercicios') ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
          <Dumbbell size={24} strokeWidth={isActive('/exercicios') ? 2.5 : 2} />
          <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive('/exercicios') ? 'opacity-100' : 'opacity-50'}`}>Exercícios</span>
        </Link>

        {/* Perfil */}
        <Link 
          href="/perfil" 
          className={`flex flex-col items-center gap-1 transition-all ${isActive('/perfil') ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
          <User size={24} strokeWidth={isActive('/perfil') ? 2.5 : 2} />
          <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive('/perfil') ? 'opacity-100' : 'opacity-50'}`}>Perfil</span>
        </Link>

      </nav>
    </div>
  );
}