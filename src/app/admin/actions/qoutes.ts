"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function finalizeQuote(cartItems: any[]) {
  // 1. Get the current user
  const session = await auth();

  // 2. If no user, they can't save a quote
  if (!session?.user?.id) {
    throw new Error("You must be logged in to request a quote.");
  }

  try {
    // 3. Create the Quote in Neon
    await (prisma as any).quote.create({
      data: {
        userId: session.user.id, // The link to the user
        status: "PENDING",
        // We store the items as a JSON snapshot so the price/name 
        // stays the same even if you change the product later
        items: cartItems, 
      },
    });

    // 4. Refresh the dashboard so the new quote appears
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Quote Error:", error);
    return { success: false };
  }
}