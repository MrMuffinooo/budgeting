"use client";

import { useContext } from "react";
import { UserDataContext } from "./Contexts";

function DebugButton() {
  const userData = useContext(UserDataContext);
  async function debug() {
    console.log("\\\\\\\\\\\\\\\\\\ debug");

    console.log(userData);

    console.log("///////// debug");
  }

  return (
    <button
      style={{ position: "fixed", bottom: 0, right: 0 }}
      onClick={() => debug()}
    >
      Debug
    </button>
  );
}

export default DebugButton;
