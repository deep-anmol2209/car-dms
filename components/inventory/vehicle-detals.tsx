"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  Gauge, 
  Hash, 
  Tag, 
  DollarSign, 
  Info,
  CarFront,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryItem } from "@/hooks/use-inventory";
import { cn } from "@/lib/utils";
import Image from "next/image";
export function VehicleDetail() {
  const params = useParams();
  const id = params?.id as string;

  const { data: vehicle, error, isLoading } = useInventoryItem(id);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Sync selected image when vehicle loads
  useEffect(() => {
    if (vehicle?.image_gallery?.length) {
      const firstImage = vehicle.image_gallery[0];
      // Handle potential string vs object mismatch based on your data structure
      const url = typeof firstImage === "string" ? JSON.parse(firstImage).url : firstImage.url;
      setSelectedImage(url);
    }
  }, [vehicle]);

  if (isLoading) return <VehicleDetailSkeleton />;
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-destructive">
        <AlertCircle className="mr-2 h-5 w-5" />
        <p>Error loading vehicle: {error.message}</p>
      </div>
    );
  }

  if (!vehicle) return <div className="p-8 text-center text-muted-foreground">Vehicle not found.</div>;

  // Safe parsing of images
  const parsedImages = vehicle.image_gallery?.map((img: any) => 
    typeof img === "string" ? JSON.parse(img) : img
  ) || [];

  const grandTotal = (vehicle.purchase_price || 0) + (vehicle.extra_costs || 0) + (vehicle.taxes || 0);
  const retailPrice = vehicle.retail_price || 0;
  const grossProfit = retailPrice - grandTotal;
  const profitMargin = retailPrice > 0 ? ((grossProfit / retailPrice) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <Badge variant="outline" className="text-base px-3 py-1 font-medium">
              {vehicle.trim}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Hash className="h-4 w-4" /> Stock: {vehicle.stock_number || "N/A"}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Added: {new Date().toLocaleDateString()} {/* Replace with actual date if available */}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <Badge variant={vehicle.condition === "New" ? "default" : "secondary"} className="px-4 py-1.5 text-sm">
                {vehicle.condition}
            </Badge>
            <Badge 
                variant={vehicle.status === "Active" ? "success" : vehicle.status === "Sold" ? "destructive" : "outline"}
                className={cn(
                    "px-4 py-1.5 text-sm",
                    vehicle.status === "Active" && "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
                    vehicle.status === "Sold" && "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                )}
            >
                {vehicle.status}
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT COLUMN: IMAGES (7/12) ================= */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-none shadow-sm overflow-hidden bg-muted/20">
            <div className="aspect-[4/3] relative w-full overflow-hidden rounded-xl bg-background border">
              {selectedImage ? (
             <Image
             src={selectedImage}
             alt={`${vehicle.make} ${vehicle.model}`}
             fill
             sizes="(max-width: 1024px) 100vw, 60vw"
             className="object-cover transition-transform duration-500 hover:scale-105"
           />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50">
                  <CarFront className="h-16 w-16 mb-2 opacity-20" />
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </Card>

          {parsedImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {parsedImages.map((img: any, idx: number) => (
                <button
                  key={img.fileId || idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === img.url
                      ? "border-primary ring-2 ring-primary/20 scale-95"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-border"
                  )}
                >
                 <Image
  src={img.thumbnailUrl || img.url}
  alt="thumbnail"
  fill
  sizes="120px"
  className="object-cover"
/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: DETAILS (5/12) ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              icon={Gauge} 
              label="Odometer" 
              value={`${vehicle.odometer?.toLocaleString()} km`} 
            />
            <StatCard 
              icon={Tag} 
              label="VIN" 
              value={vehicle.vin} 
              className="font-mono text-xs truncate"
            />
          </div>

          {/* Financial Breakdown Card */}
          <Card className="shadow-md border-muted">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Financial Overview
              </CardTitle>
              <CardDescription>Breakdown of costs and profitability</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              
              {/* Cost Stack */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-medium">${vehicle.purchase_price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Extra Costs</span>
                  <span className="font-medium">${vehicle.extra_costs?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">${vehicle.taxes?.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-semibold text-foreground">
                  <span>Total Cost</span>
                  <span>${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Profit Section */}
              <div className="bg-muted/40 p-4 rounded-lg space-y-3 border">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-muted-foreground">Retail Price</span>
                    <span className="font-bold text-lg">${retailPrice.toLocaleString()}</span>
                </div>
                
                <Separator className="bg-border/60" />

                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Net Profit</span>
                        <span className={cn("text-xs font-medium", grossProfit >= 0 ? "text-green-600" : "text-red-600")}>
                            {profitMargin}% Margin
                        </span>
                    </div>
                    <span className={cn(
                        "text-2xl font-bold tabular-nums",
                        grossProfit >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                        ${grossProfit.toLocaleString()}
                    </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info / Notes (Placeholder) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This vehicle is currently marked as <strong>{vehicle.status}</strong>. 
                Ensure all documentation is verified before proceeding with sales.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatCard({ icon: Icon, label, value, className }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="overflow-hidden">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={cn("font-semibold truncate", className)} title={value}>{value}</p>
      </div>
    </div>
  );
}

// Loading Skeleton
function VehicleDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
}