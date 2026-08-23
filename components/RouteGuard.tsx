"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RouteGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("zt_role");
    if (!role || !allowedRoles.includes(role)) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) return null;
  return <>{children}</>;
}