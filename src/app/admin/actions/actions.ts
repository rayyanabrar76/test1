"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductPrice(id: string, newPrice: number) {
  try {
    // Using (prisma as any) tells TypeScript: 
    // "Trust me, the product table exists in the database."
    await (prisma as any).product.update({
      where: { id },
      data: { price: newPrice },
    });
    
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update price" };
  }
}