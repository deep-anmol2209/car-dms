import cron from "node-cron"
import "dotenv/config"
import { runInventoryAgent } from "@/ai/agents/inventory-agent"

function startInventoryJob() {
  console.log("🚀 Worker started")

  cron.schedule("0 0 * * *", async () => {
    console.log("Running Inventory Job...")
    await runInventoryAgent()
  })
}

startInventoryJob()