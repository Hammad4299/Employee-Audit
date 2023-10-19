import { NextResponse } from "next/server";
import * as projectIssueRepo from "@/app/Repositories/ProjectIssue";

export const GET = async (request: Request) => {
  const resp = await projectIssueRepo.getAllProjectIssues();
  return resp ? resp.map((a) => NextResponse.json({ ...a })) : [];
};

export const POST = async (request: Request) => {
  const projectIssue = request.json();
  const resp = await projectIssueRepo.createUpdateProjectIssue({ ...projectIssue });
  return resp ? NextResponse.json({ ...resp }) : null;
};
