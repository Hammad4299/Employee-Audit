import initDatabase from "@/app/Database/DB";
import IssueDetailModal from "@/app/Models/IssueDetailModal";
import ProjectIssueModal from "@/app/Models/ProjectIssueModal";
import ProjectModal from "@/app/Models/ProjectModal";
import WorkspaceModal from "@/app/Models/WorkspaceModal";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("sdads");
  await IssueDetailModal.findOne();
  await ProjectModal.findOne();
  await ProjectIssueModal.findOne();
  await WorkspaceModal.findOne();
  await initDatabase.sync();
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "*",
};
