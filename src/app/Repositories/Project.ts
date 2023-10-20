import ProjectModal from "@/app/Models/ProjectModal";
export async function getAllProjects() {
  const row = await ProjectModal.findAll();
  return row
    ? row
        .map((a) => a.toJSON())
        .map((x) => ({ ...x, aliases: JSON.parse(x.aliases as any) || [] }))
    : [];
}
export async function getProjectById(id: string) {
  const row = await ProjectModal.findOne({
    where: {
      id: id,
    },
  });
  return row ? row.toJSON() : null;
}
export async function createProject(project: any) {
  const row = await ProjectModal.build({
    ...project,
  });
  const resp = await row.save();
  return resp ? resp.toJSON() : null;
}
export async function updateProjectData(project: any, id: string) {
  const row = await ProjectModal.update(
    { ...project },
    {
      where: {
        id: id,
      },
    }
  );
  return getProjectById(id);
}
export async function deleteProject(id: string) {
  return await ProjectModal.destroy({
    where: {
      id: id,
    },
  });
}
