import { NextResponse } from "next/server";
import * as workspaceRepo from "@/app/Repositories/Workspace";

export const GET = async (request: Request) => {
  const resp = await workspaceRepo.getAllWorkspaces();
  return resp ? resp.map((a) => NextResponse.json({ ...a })) : [];
};

export const POST = async (request: Request) => {
  const workspace = request.json();
  const resp = await workspaceRepo.createUpdateWorkspace({ ...workspace });
  return resp ? NextResponse.json({ ...resp }) : null;
};
