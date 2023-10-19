import { NextResponse } from "next/server";
import * as projectRepo from "@/app/Repositories/Project";

export const GET = async (request: Request) => {
  const resp = await projectRepo.getAllProjects();
  return resp ? NextResponse.json(resp) : [];
};

export const POST = async (request: Request) => {
  const project = await request.json();
  const resp = await projectRepo.createProject({ ...project });
  return resp ? NextResponse.json({ ...resp }) : null;
};
