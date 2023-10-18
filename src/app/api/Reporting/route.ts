import ProjectModal from "@/app/Models/ProjectModal";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {};
export const GET = async (request: Request) => {
  const project = await ProjectModal.findAll();
  return NextResponse.json({ data: project }, { status: 200 });
};

export const PUT = async (request: Request) => {};

export const DELETE = async (request: Request) => {};
