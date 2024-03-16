"use client";

import "dayjs/locale/pl";
import dayjs from "dayjs";
import styles from "./page.module.css";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AsideFilter from "@/components/AsideFilter";
export default function Dashboard() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
          <div>
            <Avatar sx={{ width: 56, height: 56 }} /> Mr Muffin
          </div>
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
          <div>
            <SettingsIcon fontSize="large" />
          </div>
        </LocalizationProvider>
      </header>
      <article></article>
      <AsideFilter />
    </main>
  );
}
