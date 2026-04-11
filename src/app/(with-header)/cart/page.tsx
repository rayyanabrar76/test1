import type { Metadata } from "next";
import CartPageClient from "@/app/(with-header)/cart/CartPage";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review and submit your APS deployment manifest with selected industrial power assets and configurations.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartRoutePage() {
  return <CartPageClient />;
}

