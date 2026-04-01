import { getRestockDecision } from "@/lib/services/ai-decision"
import { sendRestockAlert } from "@/lib/services/email-service"
import { getInventoryInsights } from "@/lib/services/inventry-service"

/* -------------------------------------------------------------------------- */
/*                           INVENTORY AGENT                                  */
/* -------------------------------------------------------------------------- */

export async function runInventoryAgent() {
  try {
    console.log("🤖 Running Inventory AI Agent...")

    const cars = await getInventoryInsights()

    for (const car of cars) {
      try {
        const decision = await getRestockDecision(car)

        if (decision.action === "RESTOCK") {
          await sendRestockAlert({
            model: car.model,
            stock: car.currentStock,
            sales: car.salesLast7Days,
            priority: decision.priority,
            recommendedQty: decision.recommendedQty,
            reason: decision.reason,
          })

          console.log(`📩 Alert sent for ${car.model}`)
        }
      } catch (err) {
        console.error(`❌ Error processing ${car.model}:`, err)
      }
    }

    console.log("✅ Inventory Agent Completed")
  } catch (error) {
    console.error("❌ Inventory Agent Failed:", error)
  }
}