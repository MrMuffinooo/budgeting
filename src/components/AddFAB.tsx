import React from "react";

import styles from "./css/addFab.module.scss";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

function AddFAB() {
  return (
    <div className={styles.add}>
      <Link href="/dashboard/add">
        <Fab aria-label="add">
          <AddIcon />
        </Fab>
      </Link>
    </div>
  );
}

export default AddFAB;
