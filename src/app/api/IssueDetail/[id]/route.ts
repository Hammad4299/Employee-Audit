import * as issueDetailRepo from "@/app/Repositories/IssueDetail";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await issueDetailRepo.getIssueDetailById(id);
  return resp ? NextResponse.json({ ...resp }) : null;
};

export const PUT = async (request: Request, context: { params: any }) => {
  const issueDetail = await request.json();
  const id = context.params.id;
  const old = await issueDetailRepo.getIssueDetailById(id);
  if (old) {
    const resp = await issueDetailRepo.updateIssueDetailData(
      { ...issueDetail },
      id
    );
    return resp ? NextResponse.json({ ...resp }) : null;
  } else {
    const resp = await issueDetailRepo.createIssueDetail({
      ...issueDetail,
    });
    return resp ? NextResponse.json({ ...resp }) : null;
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await issueDetailRepo.deleteIssueDetail(id);
  return resp ? NextResponse.json(resp) : null;
};
