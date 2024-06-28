"use client";

import "dayjs/locale/pl";
import styles from "./page.module.scss";
import InputAdornment from "@mui/material/InputAdornment";
import { FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

import ListedCategories from "@/components/ListedCategories";

export default function AddExpence({}) {
  const [amount, setAmount] = useState(0);
  const [amountVisible, setAmountVisible] = useState("");
  const [amountHelperText, setAmountHelperText] = useState("");
  const [comment, setComment] = useState("");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();

    const response = await fetch("/api/addItem", {
      method: "POST",
    });
    console.log(response);
    if (response.ok) {
      router.push("/dashboard");
    } else {
      console.error("add error");
    }

    setIsLoading(false);
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          <p>Add expence</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.form}>
            <div className={styles.amount_field_container}>
              <TextField
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
                autoFocus
                error={amountHelperText ? true : false}
                helperText={amountHelperText}
                value={amountVisible}
                onChange={(e) => validateAmount(e.target.value)}
                className={styles.amount_field}
              />
            </div>
            <div>
              <p>Category</p>
              <div className={styles.icons_container}>
                <ListedCategories isEdit />
              </div>
            </div>
            <div>
              <div>
                <p>Date:</p>
              </div>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pl"
              >
                <DatePicker
                  defaultValue={dayjs()}
                  slotProps={{
                    field: { className: styles.date_picker },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div>
              <TextField
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                fullWidth
                label="Comment"
              />
            </div>
            <div>
              <Button
                variant="contained"
                type="submit"
                size="large"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Add"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
