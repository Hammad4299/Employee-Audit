import { Workspace } from "@/app/DomainModals";
import WorkspaceModal from "@/app/Models/WorkspaceModal";

export async function getAllWorkspaces(): Promise<Workspace[]> {
  const row = await WorkspaceModal.findAll();
  return row ? row.map((a: any) => a.toJSON()) : [];
}
export async function getWorkspaceById(id: string) {
  const row = await WorkspaceModal.findOne({
    where: {
      id: id,
    },
  });
  return row ? row.toJSON() : null;
}
export async function createWorkspace(workspace: any) {
  const row = await WorkspaceModal.build({
    ...workspace,
  });
  const resp = await row.save();
  return resp ? resp.toJSON() : null;
}
export async function updateWorkspaceData(workspace: any, id: string) {
  const row = await WorkspaceModal.update(
    { ...workspace },
    {
      where: {
        id: id,
      },
    }
  );
  return getWorkspaceById(id);
}
export async function deleteWorkspace(id: string) {
  return await WorkspaceModal.destroy({
    where: {
      id: id,
    },
  });
}
