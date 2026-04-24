"use server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function getOnlineInterpreters() {
  try {
    let interpreters: any[] = [];
    let retries = 3;
    
    while (retries > 0) {
      try {
        await connectDB();
        interpreters = await User.find({
          role: "interpreter",
          "interpreterData.status": "verified",
          "interpreterData.isOnline": true
        }).select("name email interpreterData");
        break; // Success!
      } catch (e) {
        retries--;
        if (retries === 0) throw e;
        console.log(`📡 MongoDB Retry (${3 - retries})...`);
        await new Promise(r => setTimeout(r, 1000)); // Wait 1s
      }
    }

    return { 
      success: true, 
      interpreters: JSON.parse(JSON.stringify(interpreters)) 
    };
  } catch (error) {
    console.error("Error fetching interpreters:", error);
    return { success: false, interpreters: [] };
  }
}
