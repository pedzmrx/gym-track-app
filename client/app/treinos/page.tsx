import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TreinosListClient from "./TreinosListClient";

export default async function TreinosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const userId = (session.user as any).id;

  const meusTreinos = await prisma.workout.findMany({
    where: { userId: userId },
    include: { exercises: true },
    orderBy: { createdAt: "desc" }
  });

  return <TreinosListClient meusTreinos={meusTreinos} />;
}