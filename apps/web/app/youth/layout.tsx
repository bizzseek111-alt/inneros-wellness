"use client";

import React from "react";
import { YouthProvider } from "@/components/youth/YouthContext";

export default function YouthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <YouthProvider>{children}</YouthProvider>;
}
