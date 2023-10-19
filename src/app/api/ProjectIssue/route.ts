import { NextResponse } from "next/server";
import * as projectIssueRepo from "@/app/Repositories/ProjectIssue";

export const GET = async (request: Request) => {
  const resp = await projectIssueRepo.getAllProjectIssues();
  return resp ? NextResponse.json(resp) : [];
};

export const POST = async (request: Request) => {
  const projectIssue = await request.json();
  const resp = await projectIssueRepo.createProjectIssue({ ...projectIssue });
  return resp ? NextResponse.json({ ...resp }) : null;
};
