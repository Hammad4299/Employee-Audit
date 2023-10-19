import { NextResponse } from "next/server";
import * as workspaceRepo from "@/app/Repositories/Workspace";
import { NextApiRequest } from "next";
import { ToggleService } from "@/app/Services/Toggle";
import config from "@/app/config/config";

const ToggleInstance = new ToggleService(config.toggl.apiToken || "");
export const GET = async (request: Request) => {
  const workSpaces = await ToggleInstance.getAllWorkSpaces();
  await workspaceRepo.createBulkWorkspaces(
    workSpaces.map((x) => ({
      owner: x.name,
      toggleId: x.id,
      billRate: null,
    }))
  );
  const resp = await workspaceRepo.getAllWorkspaces();
  return NextResponse.json(resp);
};

export const POST = async (request: Request) => {
  const workspace = await request.json();
  const resp = await workspaceRepo.createWorkspace({ ...workspace });
  return resp ? NextResponse.json({ ...resp }) : null;
};
