"use server";

import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Common settings keys:
 * - call_rate_per_minute: number
 * - platform_fee_percentage: number
 * - kyc_required: boolean
 */

export async function getPlatformSettings() {
  try {
    await connectDB();
    const settings = await Settings.find({});
    
    // Default fallback settings if none exist
    const defaults = {
      call_rate_per_minute: 0.75,
      platform_fee_percentage: 15,
      kyc_required: true
    };

    const settingsMap: any = { ...defaults };
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    return settingsMap;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

export async function updatePlatformSetting(key: string, value: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      throw new Error("Unauthorized");
    }

    await connectDB();
    
    await Settings.findOneAndUpdate(
      { key },
      { 
        value, 
        updatedBy: (session.user as any).id 
      },
      { upsert: true, new: true }
    );

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating setting:", error);
    return { success: false, error: error.message };
  }
}
