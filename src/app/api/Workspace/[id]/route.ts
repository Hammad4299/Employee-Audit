import * as workspaceRepo from "@/app/Repositories/Workspace";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await workspaceRepo.getWorkspaceById(id);
  return resp ? NextResponse.json({ ...resp }) : null;
};

export const PUT = async (request: Request, context: { params: any }) => {
  const workspace = request.json();
  const id = context.params.id;
  const old = await workspaceRepo.getWorkspaceById(id);
  if (old) {
    const resp = await workspaceRepo.updateWorkspaceData({ ...workspace }, id);
    return resp ? NextResponse.json({ ...resp }) : null;
  } else {
    const resp = await workspaceRepo.createUpdateWorkspace({ ...workspace });
    return resp ? NextResponse.json({ ...resp }) : null;
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await workspaceRepo.deleteWorkspace(id);
  return resp ? NextResponse.json(resp) : null;
};
