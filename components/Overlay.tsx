"use client";
import React from "react";
import Store from "@/helper/store";
const Overlay = () => {
  const { isShowSidebar, onToggleSidebar } = Store.useMain();
  return (
    <div
      className={` inset-0 bg-black/50 absolute z-20 ${
        isShowSidebar ? "block" : "hidden"
      } lg:hidden `}
      onClick={onToggleSidebar}
    />
  );
};

export default Overlay;
