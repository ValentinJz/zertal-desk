"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";

const PUBLIC_ROUTES = ["/login"];
const ADMIN_ROUTES = ["/admin", "/knowledge"];

export default function HeaderWrapper() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("zt_role");
    if (PUBLIC_ROUTES.includes(path)) return;
    if (!role) { router.push("/login"); return; }
    if (ADMIN_ROUTES.includes(path) && role !== "admin") {
      router.push("/");
    }
  }, [path]);

  if (PUBLIC_ROUTES.includes(path)) return null;
  return <Header />;
}