"use client";

import { signIn } from "next-auth/react";
import { Activity, Chrome } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-white font-sans">
      
      <div className="mb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
          <Activity size={40} className="text-white" />
        </div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none text-center">
          GYM<span className="text-blue-600">TRACK</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">
          Evolution System
        </p>
      </div>

      <div className="w-full max-w-sm bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] backdrop-blur-md shadow-2xl flex flex-col items-center mb-8">
        <h2 className="text-xl font-black italic uppercase text-center mb-10 tracking-tight">
          Bora treinar?
        </h2>
        
        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 uppercase italic text-sm hover:bg-zinc-200 active:scale-95 transition-all shadow-xl"
        >
          <Chrome size={20} />
          Entrar com Google
        </button>

        <div className="text-center mt-10 space-y-4">
          <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest leading-loose">
            Ao entrar, você concorda em <br /> esmagar as metas de hoje.
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
            PS: ALICE, TE AMO <span className="text-red-500 text-sm">❤️</span>
          </p>
        </div>
      </div>

      <div className="text-center opacity-40">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
          Manaus • AM
        </span>
      </div>

    </main>
  );
}