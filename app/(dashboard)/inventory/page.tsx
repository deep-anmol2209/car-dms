
import { getInventoryAnalytics, getVehicles } from "@/lib/actions/inventory";
import InventoryPage from "@/components/inventory/inventory-client";
import InventoryAnalytics from "@/components/inventory/inventory-analytics";

export default async function InventoryyPage() {
 
const analytics = await getInventoryAnalytics();
 console.log(analytics);
 

  return (
    <div className="flex-1 space-y-8 p-8">
      

      <InventoryPage analytics={analytics} />
    </div>
  );
}