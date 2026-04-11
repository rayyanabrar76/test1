import type { ReactNode } from "react";
import { NavbarWithCart } from "@/components/NavbarWithCart";

export default function WithNavbarLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarWithCart />
      {children}
    </>
  );
}

