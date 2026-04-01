import cron from "node-cron"
import { runInventoryAgent } from "@/ai/agents/inventory-agent"

export function startInventoryJob() {
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running Inventory Job...")
    await runInventoryAgent()
  })
}