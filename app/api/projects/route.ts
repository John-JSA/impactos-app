import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      raised: 0,
    },
  });

  return Response.json(project);
}

export async function PATCH(req: Request) {
  const body = await req.json();

  if (body.amount) {
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

  const updated = await prisma.project.update({
    where: { id: Number(body.id) },
    data: {
      title: body.title,
      description: body.description,
      location: body.location,
      beneficiaries: body.beneficiaries,
      fundingGoal: Number(body.fundingGoal),
    },
  });

  return Response.json(updated);
}

export async function DELETE(req: Request) {
  const body = await req.json();

  await prisma.project.delete({
    where: { id: Number(body.id) },
  });

  return Response.json({ success: true });
}
