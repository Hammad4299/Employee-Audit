import { IssueDetail } from "@/app/DomainModals";
import IssueDetailModal from "@/app/Models/IssueDetailModal";
export async function getAllIssueDetails(): Promise<IssueDetail> {
  const row = await IssueDetailModal.findAll();
  return row ? row.map((a: any) => a.toJSON()) : [];
}
export async function getIssueDetailById(id: string) {
  const row = await IssueDetailModal.findOne({
    where: {
      id: id,
    },
  });
  return row ? row.toJSON() : null;
}
export async function createUpdateIssueDetail(issueDetail: any) {
  const [row, initialized] = await IssueDetailModal.findOrBuild({
    where: {
      id: issueDetail.id,
    },
    defaults: {
      ...issueDetail,
    },
  });
  return row ? row.toJSON() : null;
}
export async function updateIssueDetailData(issueDetail: any, id: string) {
  const row = await IssueDetailModal.update(
    { ...issueDetail },
    {
      where: {
        id: id,
      },
    }
  );
  return getIssueDetailById(id);
}
export async function deleteIssueDetail(id: string) {
  return await IssueDetailModal.destroy({
    where: {
      id: id,
    },
  });
}
