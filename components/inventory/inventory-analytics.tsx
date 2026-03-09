"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function InventoryAnalytics({
  totalInventory,
  totalPurchaseValue,
  totalRetailValue,
}: {
  totalInventory: number;
  totalPurchaseValue: number;
  totalRetailValue: number;
}) {
  const data = [
    { name: "Inventory", value: totalInventory, color: "#10b981" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {totalInventory}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Value</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          ${totalPurchaseValue.toLocaleString()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retail Value</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          ${totalRetailValue.toLocaleString()}
        </CardContent>
      </Card>
    </div>
  );
}