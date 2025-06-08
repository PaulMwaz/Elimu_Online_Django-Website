const fs = require("fs");
const path = require("path");

const vitePath = path.join(__dirname, "node_modules", ".bin", "vite");

try {
  fs.chmodSync(vitePath, 0o755); // Set executable permission (Linux/macOS)
  console.log("✅ vite binary marked executable.");
} catch (err) {
  console.log("ℹ️ Skipped chmod (likely on Windows):", err.message);
}
