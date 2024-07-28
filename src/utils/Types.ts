import { Dispatch, SetStateAction } from "react";

export interface UserData {
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

export interface UserDataContextType {
  data: UserData;
  setData: Dispatch<SetStateAction<UserData>>;
  refetch: () => void;
}
