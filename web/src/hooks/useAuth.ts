"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check");
      if (!response.ok) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);
};
