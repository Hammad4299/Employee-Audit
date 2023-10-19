import * as projectRepo from "@/app/Repositories/Project";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await projectRepo.getProjectById(id);
  return resp ? NextResponse.json({ ...resp }) : null;
};

export const PUT = async (request: Request, context: { params: any }) => {
  const project = await request.json();
  const id = context.params.id;
  const old = await projectRepo.getProjectById(id);
  if (old) {
    const resp = await projectRepo.updateProjectData({ ...project }, id);
    return resp ? NextResponse.json({ ...resp }) : null;
  } else {
    const resp = await projectRepo.createProject({ ...project });
    return resp ? NextResponse.json({ ...resp }) : null;
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await projectRepo.deleteProject(id);
  return resp ? NextResponse.json(resp) : null;
};
