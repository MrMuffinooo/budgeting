import React from "react";

import Icon from "@mui/material/Icon";
import { CATEGORIES } from "../constants/Categories.js";

interface props {
  fontSize?: string | number;
  icons?: String[];
}

function ListedCategories({ fontSize = 64, icons = CATEGORIES }: props) {
  const list = icons.map((cat, index) => {
    return (
      <div key={index}>
        <span>
          <Icon style={{ fontSize: fontSize }}>{cat}</Icon>
        </span>
      </div>
    );
  });

  return <>{list}</>;
}

export default ListedCategories;
