import { getBatchRestockDecision } from "@/lib/services/ai-decision"
import { sendRestockAlert } from "@/lib/services/email-service"
import { getInventoryInsights } from "@/lib/services/inventry-service"
import { getRuleBasedDecision } from "@/worker/rule-engine"

/* -------------------------------------------------------------------------- */
/*                           INVENTORY AGENT                                  */
/* -------------------------------------------------------------------------- */

export async function runInventoryAgent() {
  try {
    console.log("🤖 Running Inventory AI Agent...")

    const cars = await getInventoryInsights()

    const ruleDecisions: any[] = []
    const aiCandidates: any[] = []

    /* -------------------- STEP 1: RULE ENGINE -------------------- */

    for (const car of cars) {
      const decision = getRuleBasedDecision(car)

      if (decision.action === "IGNORE") continue

      // Edge cases → send to AI
      if (
        car.currentStock >= 3 &&
        car.currentStock <= 5 &&
        car.salesLast7Days > 3
      ) {
        aiCandidates.push(car)
      } else {
        ruleDecisions.push({
          model: car.model,
          stock: car.currentStock,
          sales: car.salesLast7Days,
          ...decision,
        })
      }
    }

    /* -------------------- STEP 2: AI BATCH CALL -------------------- */

    let aiDecisions: any[] = []

    if (aiCandidates.length > 0) {
      console.log(`🤖 Sending ${aiCandidates.length} cars to AI`)

      aiDecisions = await getBatchRestockDecision(aiCandidates)

      // map AI response properly
      aiDecisions = aiDecisions.map((d: any) => {
        const car = aiCandidates.find(c => c.model === d.model)

        return {
          model: d.model,
          stock: car?.currentStock,
          sales: car?.salesLast7Days,
          priority: d.priority,
          recommendedQty: d.recommendedQty,
          reason: d.reason,
          action: d.action,
        }
      })
    }

    /* -------------------- STEP 3: MERGE -------------------- */

    const finalDecisions = [...ruleDecisions, ...aiDecisions]
console.log("descisions: ",finalDecisions);

    /* -------------------- STEP 4: EXECUTE -------------------- */

    const restockItems = finalDecisions.filter(
      d => d.action === "RESTOCK"
    )
    
    if (restockItems.length === 0) {
      console.log("✅ No restock needed")
      return
    }
    
    await sendRestockAlert(restockItems)
    
    console.log(`📩 Sent 1 email for ${restockItems.length} items`)
    

    console.log("✅ Inventory Agent Completed")
  } catch (error) {
    console.error("❌ Inventory Agent Failed:", error)
  }
}