import WorkspaceModal from "@/app/Models/WorkspaceModal";
export async function getAllWorkspaces() {
  const row = await WorkspaceModal.findAll();
  return row ? row.map((a) => a.toJSON()) : [];
}
export async function getWorkspaceById(id: string) {
  const row = await WorkspaceModal.findOne({
    where: {
      id: id,
    },
  });
  return row ? row.toJSON() : null;
}
export async function createUpdateWorkspace(workspace: any) {
  const [row, initialized] = await WorkspaceModal.findOrBuild({
    where: {
      id: workspace.id,
    },
    defaults: {
      ...workspace,
    },
  });
  return row ? row.toJSON() : null;
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
