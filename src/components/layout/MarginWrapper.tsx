"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function MarginWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Exclude dashboard routes
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="w-full px-[10%]">
      {children}
    </div>
  );
}
