"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const [curUser, setCurUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAuthData = async () => {
      try {
        const authCheck = await fetch("/api/auth/check", {
          credentials: "include",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!authCheck.ok) throw new Error("Unauthorized");

        const userResponse = await fetch("/api/auth/get_user", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user");

        const userData = await userResponse.json();

        if (isMounted) {
          setCurUser({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            username: userData.username || "",
            email: userData.email || "",
            avatarSrc: userData.avatarSrc || "",
            photos: userData.photos || [],
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Auth error:", error);
          router.replace("/login");
          setIsLoading(false);
        }
      }
    };

    fetchAuthData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [router]);

  return { curUser, isLoading };
};
