import { NextResponse } from "next/server";
import * as issueDetailRepo from "@/app/Repositories/IssueDetail";

export const GET = async (request: Request) => {
  const resp = await issueDetailRepo.getAllIssueDetails();
  return resp ? NextResponse.json(resp) : [];
};

export const POST = async (request: Request) => {
  const IssueDetail = await request.json();
  const resp = await issueDetailRepo.createIssueDetail({ ...IssueDetail });
  return resp ? NextResponse.json({ ...resp }) : null;
};
