import { sendRestockAlert } from "@/lib/services/email-service"

/* -------------------------------------------------------------------------- */
/*                           TOOL DEFINITION (OPTIONAL)                        */
/* -------------------------------------------------------------------------- */

export const notificationTools = {
  send_restock_alert: {
    name: "send_restock_alert",
    description: "Send restock alert email to admin",
  },
}

/* -------------------------------------------------------------------------- */
/*                           TOOL EXECUTION                                   */
/* -------------------------------------------------------------------------- */

export async function executeNotificationTool(
  toolName: string,
  data: any
) {
  switch (toolName) {
    case "send_restock_alert":
      return await sendRestockAlert(data)

    default:
      throw new Error(`Unknown notification tool: ${toolName}`)
  }
}