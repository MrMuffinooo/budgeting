import { createContext, Dispatch } from "react";
import { UserDataContextType } from "./Types";

export const UserDataContext = createContext<UserDataContextType>(
  {} as UserDataContextType
);
