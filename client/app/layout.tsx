import './globals.css';
import Link from 'next/link';
import AuthProvider from '@/components/AuthProvider';
import LoginButton from '@/components/LoginButton';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-[#0f172a] text-slate-100 min-h-screen antialiased">
        <AuthProvider>
          {/* BARRA DE NAVEGAÇÃO PRINCIPAL */}
          <nav className="border-b border-slate-800 bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 8 8"/><path d="m14 6 8 8"/></svg>
                </div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tighter">
                  GYM TRACK
                </span>
              </Link>

              {/* LINKS E AUTH */}
              <div className="flex gap-8 items-center">
                <div className="hidden md:flex gap-6 text-sm font-bold tracking-widest text-slate-400">
                  <Link href="/treinos" className="hover:text-blue-400 transition-colors uppercase">
                    Montagem
                  </Link>
                  <Link href="/biblioteca" className="hover:text-blue-400 transition-colors uppercase">
                    Biblioteca
                  </Link>
                </div>
                
                {/* LINHA DIVISORA VERTICAL */}
                <div className="hidden md:block w-[1px] h-6 bg-slate-800"></div>

                {/* COMPONENTE DE LOGIN*/}
                <LoginButton />
              </div>

            </div>
          </nav>

          {/* CONTEÚDO DA PÁGINA */}
          <main className="relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}