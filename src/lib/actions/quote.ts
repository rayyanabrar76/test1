"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const RESEND_SENDER_EMAIL = "rayyanabrar76@gmail.com";

// Read from .env instead of hardcoded
const ROOT_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
  .split(",")
  .map(e => e.trim());

async function sendInquiryEmail(
  quoteId: string, 
  cartItems: any[], 
  email: string, 
  name: string,
  phone: string,
  subject: string,
  notes: string
) {
  console.log("🚀 SYSTEM: INITIALIZING EMAIL VIA RESEND...");
  
  const recipients: string[] = [RESEND_SENDER_EMAIL];
  
  if (email && email.includes("@") && !email.toLowerCase().includes("guest")) {
    recipients.push(email);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "APS Inquiry <onboarding@resend.dev>",
      to: recipients, 
      subject: `[INQUIRY] ${subject.toUpperCase() || "NEW REQUEST"} - ${quoteId.toUpperCase()}`,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: auto; border: 1px solid #333; padding: 20px; background-color: #f9f9f9;">
          <h2 style="text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px;">Technical Manifest</h2>
          
          <div style="margin-bottom: 20px;">
            <p><strong>LOG_ID:</strong> ${quoteId.toUpperCase()}</p>
            <p><strong>CUSTOMER:</strong> ${name}</p>
            <p><strong>EMAIL:</strong> ${email}</p>
            <p><strong>PHONE:</strong> ${phone}</p>
            <p><strong>SUBJECT:</strong> ${subject || "General Inquiry"}</p>
          </div>

          <hr style="border: 0; border-top: 1px dashed #ccc;" />
          
          <h3 style="text-transform: uppercase;">User Message:</h3>
          <p style="background: #fff; padding: 15px; border-left: 4px solid #000;">
            ${notes || "No additional notes provided."}
          </p>

          <hr style="border: 0; border-top: 1px dashed #ccc;" />

          <h3>BILL OF MATERIALS:</h3>
          <ul style="list-style: square;">
            ${cartItems.map(item => `
              <li style="margin-bottom: 10px;">
                <strong>${item.name}</strong> — QTY: ${item.qty}
              </li>
            `).join('')}
          </ul>
          
          <div style="margin-top: 30px; font-size: 11px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
            APS_SYSTEM_LOG // AUTH_BY_RESEND_76 // SERVER_LOCAL
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ RESEND_ERROR:", error.message);
    } else {
      console.log("✅ SYSTEM: EMAIL DISPATCHED TO RECIPIENTS:", recipients);
    }
  } catch (error) {
    console.error("❌ MAIL_CRITICAL_FAILURE:", error);
  }
}

/**
 * 1. CREATE QUOTE
 */
export async function createQuoteAction(
  cartItems: any[], 
  total: number, 
  category: string, 
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    notes: string;
  }
) {
  const session = await auth();

  try {
    const quote = await prisma.quote.create({
      data: {
        userId: session?.user?.id || undefined,
        items: cartItems,
        total: total,
        category: category.toLowerCase() || "standard",
        status: "pending",
      },
    });

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    await sendInquiryEmail(
      quote.id, 
      cartItems, 
      formData.email || session?.user?.email || "Guest", 
      fullName || session?.user?.name || "Guest User",
      formData.phone,
      formData.subject,
      formData.notes
    );

    revalidatePath("/dashboard");
    revalidatePath("/admin/manifests");
    
    return { success: true, quoteId: quote.id };
  } catch (err) {
    console.error("DB_CREATE_ERROR:", err);
    return { error: "TRANSMISSION_FAILURE: Could not log to Database." };
  }
}

/**
 * 2. DELETE QUOTE
 */
export async function deleteQuoteAction(quoteId: string) {
  const session = await auth();

  if (!session?.user?.id) return { error: "UNAUTHORIZED" };

  try {
    await prisma.quote.delete({
      where: {
        id: quoteId,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/quotes");
    return { success: true };
  } catch (err) {
    return { error: "PURGE_FAILURE" };
  }
}

/**
 * 3. UPDATE STATUS (ROOT ADMIN ONLY)
 */
export async function updateQuoteStatusAction(quoteId: string, newStatus: string) {
  const session = await auth();
  
  if (!ROOT_ADMIN_EMAILS.includes(session?.user?.email ?? "")) {
    console.warn(`🚨 SECURITY_ALERT: Unauthorized status change attempt by ${session?.user?.email}`);
    return { error: "ACCESS_DENIED: Root Authority Required." };
  }

  try {
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: newStatus.toLowerCase() },
    });
    
    revalidatePath("/admin/quotes");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (err) {
    console.error("DB_UPDATE_ERROR:", err);
    return { error: "SYNC_FAILURE" };
  }
}