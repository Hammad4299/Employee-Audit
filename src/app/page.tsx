import { Container, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  return redirect("/audit");
}
