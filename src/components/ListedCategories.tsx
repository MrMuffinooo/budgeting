import React, { useState } from "react";

import Icon from "@mui/material/Icon";
import { CATEGORIES } from "../constants/Categories.js";

interface props {
  fontSize?: string | number;
  icons?: {
    id: number;
    color: string;
    icon: string;
    title: string;
  }[];
  isEdit?: boolean;
}

function ListedCategories({
  fontSize = 64,
  icons = CATEGORIES,
  isEdit = false,
}: props) {
  const [category, setCategory] = useState<number | null>(null);

  const list = icons.map((cat, index) => {
    return (
      <div key={index} onClick={() => setCategory(index)}>
        <div
          style={{
            backgroundColor: index === category ? cat.color : "inherit",
            borderColor: index === category ? "white" : cat.color,
          }}
        >
          <span>
            <Icon
              style={{
                fontSize: fontSize,
                color: index === category ? "white" : "black",
              }}
            >
              {cat.icon}
            </Icon>
          </span>
        </div>
        <h5>{cat.title}</h5>
      </div>
    );
  });

  const editButton = (
    <div>
      <div>
        <span>
          <Icon style={{ fontSize: fontSize }}>more_horiz</Icon>
        </span>
      </div>
    </div>
  );

  return (
    <>
      {list} {isEdit ? editButton : null}
    </>
  );
}

export default ListedCategories;
