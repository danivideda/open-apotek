"use client";

import { usePathname, useSearchParams } from "next/navigation";

export default function Navbar() {
  return (
    <div>
      <h1>Current path: {usePathname()}</h1>
      <h1>Current searchParam: {useSearchParams().get("something")}</h1>
    </div>
  );
}
