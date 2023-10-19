import { NextResponse } from "next/server";
import * as issueDetailRepo from "@/app/Repositories/IssueDetail";

export const GET = async (request: Request) => {
  const resp = await issueDetailRepo.getAllIssueDetails();
  return resp ? resp.map((a) => NextResponse.json({ ...a })) : [];
};

export const POST = async (request: Request) => {
  const IssueDetail = request.json();
  const resp = await issueDetailRepo.createUpdateIssueDetail({ ...IssueDetail });
  return resp ? NextResponse.json({ ...resp }) : null;
};
