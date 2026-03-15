import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import { Bell, Dumbbell } from "lucide-react";
import ConsistencyWidget from "@/components/ConsistencyWidget";
import TodayWorkoutCard from "@/components/TodayWorkoutCard";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // SE O USUÁRIO NÃO ESTIVER LOGADO:
  if (!session) {
    return (
      <main className="relative min-h-[100dvh] flex flex-col items-center justify-end p-6">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
          alt="Fundo Academia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>

        {/* Conteúdo do Login */}
        <div className="relative z-10 w-full max-w-md flex flex-col gap-10 text-center pb-12">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-600/30">
              <Dumbbell size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight">
              GYM <span className="text-blue-500">TRACK</span>
            </h1>
            <p className="text-zinc-400 text-lg font-medium">
              Faça login e vamos crescer sua Franga!
            </p>
          </div>

          <GoogleLoginButton />
        </div>
      </main>
    );
  }

  // SE O USUÁRIO ESTIVER LOGADO:
  return (
    <main className="min-h-[100dvh] max-w-md mx-auto p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between w-full mt-4">
        <div className="flex items-center gap-4">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="Foto de perfil"
              width={48}
              height={48}
              className="rounded-full border-2 border-zinc-800"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-400 font-medium">U</span>
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">
              Olá, {session.user?.name?.split(" ")[0] || "Atleta"}
            </h1>
            <p className="text-zinc-400 text-sm">Bora treinar hoje?</p>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-2xl transition-colors shadow-lg shadow-blue-600/20">
          <Bell size={20} />
        </button>
      </header>

      <ConsistencyWidget />
      <TodayWorkoutCard />
    </main>
  );
}