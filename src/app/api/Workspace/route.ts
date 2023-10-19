import { NextResponse } from "next/server";
import * as workspaceRepo from "@/app/Repositories/Workspace";
import { NextApiRequest } from "next";

export const GET = async (request: Request) => {
  const resp = await workspaceRepo.getAllWorkspaces();
  return resp ? NextResponse.json(resp) : [];
};

export const POST = async (request: Request) => {
  const workspace = await request.json();
  const resp = await workspaceRepo.createWorkspace({ ...workspace });
  return resp ? NextResponse.json({ ...resp }) : null;
};
