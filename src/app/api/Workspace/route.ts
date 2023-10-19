import { NextResponse } from "next/server";
import * as workspaceRepo from "@/app/Repositories/Workspace";
import { NextApiRequest } from "next";
import { ToggleService } from "@/app/Services/Toggle";
import config from "@/app/config/config";

const ToggleInstance = new ToggleService(config.toggl.apiToken || "");
export const GET = async (request: Request) => {
  const workSpaces = await ToggleInstance.getAllWorkSpaces();
  const resp = await workspaceRepo.getAllWorkspaces();
  const toInsert = workSpaces.filter(
    (x) => !resp.find((y) => y.toggleId === x.id)
  );
  await workspaceRepo.createBulkWorkspaces(
    toInsert.map((x) => ({
      owner: x.name,
      toggleId: x.id,
      billRate: null,
    }))
  );
  return NextResponse.json(await workspaceRepo.getAllWorkspaces());
};

export const POST = async (request: Request) => {
  const workspace = await request.json();
  const resp = await workspaceRepo.createWorkspace({ ...workspace });
  return resp ? NextResponse.json({ ...resp }) : null;
};
