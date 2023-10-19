import { NextResponse } from "next/server";
import * as projectRepo from "@/app/Repositories/Project";

export const GET = async (request: Request) => {
  const resp = await projectRepo.getAllProjects();
  return resp ? resp.map((a) => NextResponse.json({ ...a })) : [];
};

export const POST = async (request: Request) => {
  const project = request.json();
  const resp = await projectRepo.createUpdateProject({ ...project });
  return resp ? NextResponse.json({ ...resp }) : null;
};
