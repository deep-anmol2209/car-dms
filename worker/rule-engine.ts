export function getRuleBasedDecision(car: any) {
    if (car.currentStock < 2 && car.salesLast7Days > 5) {
      return {
        action: "RESTOCK",
        priority: "HIGH",
        recommendedQty: 5,
        reason: "High demand and critically low stock",
      }
    }
  
    if (car.currentStock < 3) {
      return {
        action: "RESTOCK",
        priority: "MEDIUM",
        recommendedQty: 3,
        reason: "Low stock",
      }
    }
  
    return {
      action: "IGNORE",
    }
  }