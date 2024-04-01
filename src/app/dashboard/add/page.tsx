"use client";

import styles from "./page.module.scss";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import { useState } from "react";
import TextField from "@mui/material/TextField";

export default function AddExpence({}) {
  const [amount, setAmount] = useState(0);
  const [amountVisible, setAmountVisible] = useState("");
  const [amountHelperText, setAmountHelperText] = useState("");

  function isCommaFirst(a: string) {
    if (!a.match(/,/)) return false;
    if (!a.match(/\./)) return true;
    return a.indexOf(",") < a.indexOf(".");
  }

  function validateAmount(a: string) {
    var isComma = isCommaFirst(a);
    a = a.replaceAll(",", ".");
    var count = (a.match(/\./g) || []).length;

    var isError = false;

    if (count > 1) {
      setAmountHelperText("1 comma allowed");
      a =
        a.slice(0, a.indexOf(".") + 1) +
        a.slice(a.indexOf(".") + 1).replaceAll(/\./g, "");
      isError = true;
    }

    if (!/^[0-9\.]*$/.test(a)) {
      setAmountHelperText("Only numbers and comma allowed");
      a = a.replaceAll(/[^\d\.]/g, "");
      isError = true;
    }

    if (a.match(/\./g) && a.indexOf(".") + 3 < a.length) {
      setAmountHelperText("2 digits of precision");
      a = a.slice(0, a.indexOf(".") + 3);
      isError = true;
    }

    console.log(a);
    if (!isError) {
      setAmountHelperText("");
    }
    if (a) {
      setAmount(parseFloat(a));
      setAmountVisible(isComma ? a.replace(".", ",") : a);
    } else {
      setAmount(0);
      setAmountVisible("");
    }
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          <p>Add expence</p>
        </div>
        <div>
          <p>___ Currency</p>
          <TextField
            id="standard-adornment-amount"
            variant="standard"
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}
            autoFocus
            error={amountHelperText ? true : false}
            helperText={amountHelperText}
            value={amountVisible}
            onChange={(e) => validateAmount(e.target.value)}
          />
        </div>
        <div>
          <p>Category</p>
        </div>
        <div>
          <p>Date</p>
        </div>
        <div>
          <p>Comment</p>
        </div>
      </div>
    </main>
  );
}
