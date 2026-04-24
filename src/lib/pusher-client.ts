"use client";

import Pusher from "pusher-js";

let pusherInstance: any = null;

export const getPusherClient = () => {
  if (typeof window === "undefined") return null;
  
  if (!pusherInstance) {
    const ActualPusher = (Pusher as any).default || Pusher;
    pusherInstance = new ActualPusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        forceTLS: true,
        authEndpoint: "/api/pusher/auth"
      }
    );
  }
  return pusherInstance;
};

// For backward compatibility while we migrate
export const pusherClient = typeof window !== "undefined" ? getPusherClient() : null;
