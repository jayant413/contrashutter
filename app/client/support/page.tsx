"use client";

import React from "react";
import { apiEndpoint } from "@/helper/api";
import SupportForm from "@/components/support-form";

const Support = () => {
  return <SupportForm apiEndpoint={`${apiEndpoint}/user/support`} />;
};

export default Support;
