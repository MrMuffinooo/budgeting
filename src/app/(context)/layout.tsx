"use client";

import { UserDataContext } from "@/utils/Contexts";
import DebugButton from "@/utils/DebugButton";
import { useEffect, useState } from "react";

interface UserData {
  _id: string;
  email: string;
  displayName: string;
  isDarkMode: boolean;
  categories: {
    color: string;
    icon: string;
    title: string;
    id: number;
  }[];
  userId: string;
}

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData>({});
  const [userDataRefresh, setUserDataRefresh] = useState(0);

  function refreshUserData() {
    setUserDataRefresh((a) => a + 1);
  }

  useEffect(() => {
    async function fetchUserData() {
      console.log("fetching user data...");
      const response = await fetch("/api/userData", {
        method: "GET",
      });
      const json = await response.json();
      console.log(json);
      setUserData(json);
    }

    fetchUserData();
  }, [userDataRefresh]);

  return (
    <UserDataContext.Provider
      value={{ data: userData, setData: setUserData, refetch: refreshUserData }}
    >
      {children}

      <DebugButton />
    </UserDataContext.Provider>
  );
}
