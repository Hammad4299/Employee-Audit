import { NextResponse } from "next/server";

export const POST = async (request: Request) => {};
export const GET = async (request: Request) => {
  return NextResponse.json({ data: "Hello World" }, { status: 200 });
};

export const PUT = async (request: Request) => {};

export const DELETE = async (request: Request) => {};
