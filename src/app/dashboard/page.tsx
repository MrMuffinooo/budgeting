"use client";

import "dayjs/locale/pl";
import dayjs from "dayjs";
import styles from "./page.module.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
export default function Dashboard() {
  return (
    <main className={styles.main}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
        <div>
          <DatePicker
            defaultValue={dayjs().subtract(1, "week")}
            disableFuture
            slotProps={{
              field: { className: styles.date_picker_left },
            }}
          />
          <DatePicker
            defaultValue={dayjs()}
            disableFuture
            slotProps={{
              field: { className: styles.date_picker_right },
            }}
          />
        </div>
      </LocalizationProvider>
    </main>
  );
}
