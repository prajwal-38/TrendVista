import { execSync } from "child_process";
import path from "path";

console.log("Compiling contracts...");
try {
  execSync("npx hardhat compile", { stdio: "inherit" });
  console.log("Compilation successful!");
} catch (error) {
  console.error("Compilation failed:", error);
  process.exit(1);
}