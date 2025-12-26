const { loadEnvConfig } = require("@next/env");
const mongoose = require("mongoose");

// Load .env and .env.local the same way Next.js does
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is missing from your environment (.env)");
  process.exit(1);
}

const opts = { bufferCommands: false };

async function main() {
  const started = Date.now();
  const connection = await mongoose.connect(uri, opts);

  // Ping the database to verify the connection is healthy
  await connection.connection.db.admin().ping();

  await connection.disconnect();
  const elapsed = Date.now() - started;
  console.log(`MongoDB connection OK (ping + disconnect in ${elapsed}ms)`);
}

main().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});
