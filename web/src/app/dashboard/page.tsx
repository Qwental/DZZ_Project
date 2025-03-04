"use client";
import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.css";
import dynamic from "next/dynamic";

const Profile = dynamic(() => import("@/components/profile/profile"));
const UserPhotos = dynamic(() => import("@/components/userPhotos/userPhotos"));

export default function DahboardPage() {
  const { curUser, isLoading } = useAuth();

  console.log("User data:", curUser);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!curUser?.email) {
    return <div>Ошибка авторизации! Пользователь не найден</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.resultsZone}>
        {curUser.photos?.length ? (
          <UserPhotos pics={curUser.photos} />
        ) : (
          <div>Нет доступных фотографий</div>
        )}
      </div>
      <div className={styles.profileZone}>
        <Profile user={curUser} />
      </div>
    </div>
  );
}
