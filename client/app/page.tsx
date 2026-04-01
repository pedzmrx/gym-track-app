import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getHomeData, getEvolutionData } from "@/app/actions";
import { redirect } from "next/navigation";
import { Activity, Flame, Dumbbell, Zap } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";

const GALERIA = {
  feminino: [
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800",
    "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=800",
    "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800"
  ],
  masculino: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800",
    "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800",
    "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800"
  ]
};

const GALERIA_TREINOS = [
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400", 
  "https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=400", 
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400", 
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400", 
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400", 
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  
  const userId = (session.user as any).id;

  const [user, homeData, evolutionData] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { gender: true } }),
    getHomeData(userId),
    getEvolutionData(userId)
  ]);

  const proximoTreino = homeData.proximoTreino;
  const datasTreino = (evolutionData.datasTreino as string[]) || [];
  const streak = evolutionData.streakAtual || 0;
  
  const genero = user?.gender === "feminino" ? "feminino" : "masculino";
  const fotosBanner = GALERIA[genero];
  const fotoBannerAleatoria = fotosBanner[Math.floor(Math.random() * fotosBanner.length)];
  const fotoTreinoAleatoria = GALERIA_TREINOS[Math.floor(Math.random() * GALERIA_TREINOS.length)];
  
  const diasSemanaLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto font-sans">
      
      {/* Header */}
      <header className="mt-4 mb-8 flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Dashboard</span>
        <div className="w-10 h-10 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
          {session.user.image ? <img src={session.user.image} alt="User" className="w-full h-full object-cover" /> : <Activity size={18} className="text-zinc-400" />}
        </div>
      </header>

      {/* CARD PRINCIPAL */}
      <section className="relative h-64 w-full overflow-hidden rounded-[2.5rem] mb-10 group border border-zinc-800 shadow-2xl transition-all">
        <img 
          src={fotoBannerAleatoria} 
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
          alt="Treino Motivacional"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-white">GYM<span className="text-blue-600">TRACK</span></h2>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white leading-tight">Olá, {session.user.name?.split(' ')[0]}</h3>
              <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-wider">Bora fazer aquele treinão?</p>
            </div>
            <Link href="/treinos" className="bg-blue-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-blue-500 active:scale-90 transition-all italic text-sm">
              Bora!
            </Link>
          </div>
        </div>
      </section>

      {/* CONSISTÊNCIA */}
      <section className="mb-10 px-1">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 font-sans">Consistência</h4>
          <Link href="/evolucao" className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Ver Evolução</Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {diasSemanaLabels.map((dia, i) => {
              const hoje = new Date();
              const diaDaSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay() + i)).toISOString().split('T')[0];
              const treinou = datasTreino.includes(diaDaSemana);

              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                    treinou 
                      ? "bg-blue-600 border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                      : "bg-zinc-900 border-zinc-800"
                  }`}>
                    {treinou && <Zap size={12} fill="white" className="text-white" />}
                  </div>
                  <span className="text-[9px] font-black text-zinc-600 uppercase">{dia}</span>
                </div>
              );
            })}
          </div>
          
          <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-2xl flex items-center gap-2">
            <Flame size={16} className="text-orange-500" fill="currentColor" />
            <span className="text-lg font-black italic text-orange-500">{streak}</span>
          </div>
        </div>
      </section>

      <section className="px-1 mb-20">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 font-sans">Próximo Treino</h4>
          <Link href="/treinos" className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Todos Treinos</Link>
        </div>

        {proximoTreino ? (
          <Link href={`/treinos/${proximoTreino.id}`} className="relative block bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 overflow-hidden group active:scale-[0.98] transition-all shadow-sm">
            <div className="relative z-10">
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">
                    {proximoTreino.name}
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-widest">
                    {proximoTreino.exercises?.length || 0} exercícios • Foco Total
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell size={24} className="text-white" />
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 grayscale pointer-events-none group-hover:opacity-40 transition-all duration-700 group-hover:scale-110">
               <img src={fotoTreinoAleatoria} className="object-cover h-full w-full" alt="" />
            </div>
          </Link>
        ) : (
          <Link href="/treinos" className="block p-8 border-2 border-dashed border-zinc-800 rounded-[2.5rem] text-center">
            <p className="text-zinc-600 font-bold uppercase text-xs italic">Crie um treino para começar</p>
          </Link>
        )}
      </section>

    </main>
  );
}