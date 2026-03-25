import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import BottomNav from "@/components/BottomNav"; 

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Gym Track",
  description: "Seu aplicativo de treinos",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gym Track",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); 

  return (
    <html lang="pt-br" className="dark"> 
      <body className="bg-black text-white min-h-[100dvh] antialiased overscroll-none selection:bg-blue-500/30">
        <AuthProvider>
          <main className="relative min-h-screen">
            {children}
          </main>
          
          {session && <BottomNav />}
          
        </AuthProvider>
      </body>
    </html>
  );
}