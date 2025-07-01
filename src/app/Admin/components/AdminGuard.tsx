"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (!loggedIn) {
      router.push("/Admin/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  if (isLoggedIn === null) return null;

  return <>{children}</>;
}
