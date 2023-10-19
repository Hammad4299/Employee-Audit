import * as projectIssueRepo from "@/app/Repositories/ProjectIssue";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await projectIssueRepo.getProjectIssueById(id);
  return resp ? NextResponse.json({ ...resp }) : null;
};

export const PUT = async (request: Request, context: { params: any }) => {
  const projectIssue = request.json();
  const id = context.params.id;
  const old = await projectIssueRepo.getProjectIssueById(id);
  if (old) {
    const resp = await projectIssueRepo.updateProjectIssueData(
      { ...projectIssue },
      id
    );
    return resp ? NextResponse.json({ ...resp }) : null;
  } else {
    const resp = await projectIssueRepo.createUpdateProjectIssue({
      ...projectIssue,
    });
    return resp ? NextResponse.json({ ...resp }) : null;
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const id = context.params.id;
  const resp = await projectIssueRepo.deleteProjectIssue(id);
  return resp ? NextResponse.json(resp) : null;
};
