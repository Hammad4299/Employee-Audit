import ProjectIssueModal from "@/app/Models/ProjectIssueModal";
export async function getAllProjectIssues() {
  const row = await ProjectIssueModal.findAll();
  return row ? row.map((a) => a.toJSON()) : [];
}
export async function getProjectIssueById(id: string) {
  const row = await ProjectIssueModal.findOne({
    where: {
      id: id,
    },
  });
  return row ? row.toJSON() : null;
}
export async function createUpdateProjectIssue(projectIssue: any) {
  const [row, initialized] = await ProjectIssueModal.findOrBuild({
    where: {
      id: projectIssue.id,
    },
    defaults: {
      ...projectIssue,
    },
  });
  return row ? row.toJSON() : null;
}
export async function updateProjectIssueData(projectIssue: any, id: string) {
  const row = await ProjectIssueModal.update(
    { ...projectIssue },
    {
      where: {
        id: id,
      },
    }
  );
  return getProjectIssueById(id);
}
export async function deleteProjectIssue(id: string) {
  return await ProjectIssueModal.destroy({
    where: {
      id: id,
    },
  });
}
