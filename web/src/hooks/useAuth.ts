"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const [curUser, setCurUser] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatarSrc: "",
    photos: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    const controller = new AbortController();

    const checkAuthState = async () => {
      try {
        if (!isMounted.current) return;

        const authCheck = await fetch("/api/auth/check", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!authCheck.ok) throw new Error("Auth failed");

        const userResponse = await fetch("/api/auth/get_user", {
          credentials: "include",
          signal: controller.signal,
        });

        const userData = await userResponse.json();

        if (isMounted.current) {
          setCurUser({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            username: userData.username || "",
            email: userData.email || "",
            avatarSrc: userData.avatarSrc || "",
            photos: userData.photos || [],
          });
        }
      } catch (error) {
        if (isMounted.current) {
          router.replace("/login");
        }
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };

    checkAuthState();

    return () => {
      isMounted.current = false;
      controller.abort();
    };
  }, [router]); // Убираем curUser из зависимостей

  // console.log(curUser);
  return { curUser, isLoading };
};
