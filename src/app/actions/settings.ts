"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  email?: string;
  phone?: string;
  bio?: string;
  languages?: string[];
  specialization?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await connectDB();
    
    const updateFields: any = {};
    if (formData.email) updateFields.email = formData.email;
    if (formData.phone) updateFields.phone = formData.phone;

    // Use dot notation to avoid overwriting the entire interpreterData object
    if (formData.bio) updateFields["interpreterData.bio"] = formData.bio;
    if (formData.languages) updateFields["interpreterData.languages"] = formData.languages;
    if (formData.specialization) updateFields["interpreterData.specialization"] = formData.specialization;

    await User.findByIdAndUpdate((session.user as any).id, { $set: updateFields });
    
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
