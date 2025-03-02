"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authCheck } from "@/lib/api";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (!response.ok) throw new Error("Unauthenticated");
      } catch (error) {
        router.replace("/login");
      }
    };

    checkAuthState();
  }, [router]);
};
