import dns from "dns";

/**
 * Patch for DNS resolution issues with MongoDB Atlas SRV records
 * in certain Node.js/Hosting environments.
 */
try {
  console.log("🔗 Applying DNS patch for MongoDB resolution...");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.warn("⚠️ DNS patch failed to apply. This may be due to environment restrictions.", error);
}
