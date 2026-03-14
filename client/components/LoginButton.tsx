'use client';
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-white">{session.user?.name}</p>
          <button 
            onClick={() => signOut()} 
            className="text-[10px] text-red-400 hover:text-red-300 uppercase font-black tracking-tighter"
          >
            Sair
          </button>
        </div>
        {session.user?.image && (
          <img 
            src={session.user.image} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20"
          />
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="bg-white text-slate-900 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider hover:bg-blue-400 hover:text-white transition-all active:scale-95 flex items-center gap-2"
    >
      <img src="https://authjs.dev/img/providers/google.svg" className="w-4" alt="Google" />
      Entrar com Google
    </button>
  );
}