"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { 
  name?: string; 
  email?: string;
  phone?: string; 
  phoneNumber?: string; 
  image?: string;
  bio?: string;
  languages?: string[];
  specialization?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone || data.phoneNumber) updateData.phoneNumber = data.phone || data.phoneNumber;
    if (data.image !== undefined) updateData.image = data.image;

    // Handle nested interpreterData
    if (data.bio !== undefined || data.languages !== undefined || data.specialization !== undefined) {
      if (data.bio !== undefined) updateData["interpreterData.bio"] = data.bio;
      if (data.languages !== undefined) updateData["interpreterData.languages"] = data.languages;
      if (data.specialization !== undefined) updateData["interpreterData.specialization"] = data.specialization;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, error: "User not found" };
    }

    revalidatePath("/dashboard/client");
    revalidatePath("/dashboard/client/settings");
    
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}
