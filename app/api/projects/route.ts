import "dotenv/config";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      title: body.title,
      description: body.description,
      location: body.location,
      beneficiaries: body.beneficiaries,
      fundingGoal: Number(body.fundingGoal),
    },
  });

  return Response.json(project);
}

export async function PATCH(req: Request) {
  const body = await req.json();

  const updated = await prisma.project.update({
    where: { id: Number(body.id) },
    data: {
      raised: {
        increment: Number(body.amount),
      },
    },
  });

  return Response.json(updated);
}
