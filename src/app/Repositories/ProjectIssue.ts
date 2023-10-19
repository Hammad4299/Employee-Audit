import ProjectIssueModal from "@/app/Models/ProjectIssueModal";
import { ProjectModal } from "@/app/Models/ProjectModal";
export async function getAllProjectIssues() {
  const row = await ProjectIssueModal.findAll({
    include: [
      {
        model: ProjectModal,
        as: "project",
        required: true,
      },
    ],
  });
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
export async function createProjectIssue(projectIssue: any) {
  const row = await ProjectIssueModal.build({
    ...projectIssue,
  });
  const resp = await row.save();
  return resp ? resp.toJSON() : null;
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
