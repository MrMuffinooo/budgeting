import React from "react";

import styles from "./css/asideFilter.module.scss";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";

function AsideFilter() {
  return (
    <aside className={styles.aside}>
      <div>
        <TodayIcon className={styles.asideIcon} />
      </div>
      <div>
        <DateRangeIcon className={styles.asideIcon} />
      </div>
      <div>
        <CalendarMonthIcon className={styles.asideIcon} />
      </div>
      <div>
        <EventRepeatIcon className={styles.asideIcon} />
      </div>
      <div>
        <AllInclusiveIcon className={styles.asideIcon} />
      </div>
    </aside>
  );
}

export default AsideFilter;
