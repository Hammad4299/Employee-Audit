import ProjectModal from "@/app/Models/ProjectModal";
export async function getAllProjects() {
  const row = await ProjectModal.findAll();
  return row ? row.map((a) => a.toJSON()) : [];
}
export async function getProjectById(id: string) {
  const row = await ProjectModal.findOne({
    where: {
      id: id,
    },
  });
  return row ? row.toJSON() : null;
}
export async function createUpdateProject(project: any) {
  const [row, initialized] = await ProjectModal.findOrBuild({
    where: {
      id: project.id,
    },
    defaults: {
      ...project,
    },
  });
  return row ? row.toJSON() : null;
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
