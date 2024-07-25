"use client";
function DebugButton() {
  async function debug() {
    console.log("\\\\\\\\\\\\\\\\\\ debug");

    console.log("fetching...");
    const response = await fetch("/api/userData", {
      method: "GET",
    });
    const json = await response.json();
    console.log(json);

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
