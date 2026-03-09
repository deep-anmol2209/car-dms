"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, type VehicleFormData } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "../imagekit/fileUpload";
import { useEffect, useState } from "react";
import { uploadToImageKit } from "@/helper/upload";

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<VehicleFormData>;
}

export function VehicleForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: VehicleFormProps) {
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      status: "Active",
      condition: "New",
      odometer: 0,
      extra_costs: 0,
      taxes: 0,
      purchase_price: 0,
      retail_price: 0,
      image_gallery: [],
    },
  });

  const { watch, handleSubmit, control, formState: { isSubmitting } } = form;
  const [vehicleFiles, setVehicleFiles] = useState<File[]>([]);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);

  const purchasePrice = watch("purchase_price") || 0;
  const retailPrice = watch("retail_price") || 0;
  const extraCosts = watch("extra_costs") || 0;
  const taxes = watch("taxes") || 0;
const parsedImages= initialData?.image_gallery?.map((image) => {typeof image === "string" ? JSON.parse(image) : image}) || [];

  // Calculate financial metrics
  const grandTotalValue = purchasePrice + extraCosts + taxes;
  const grossProfit = retailPrice - grandTotalValue;
  const estimatedIncome = retailPrice - grandTotalValue;
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
  
      if (initialData.image_gallery?.length) {
        const existingPreviews = initialData.image_gallery.map(
          (img) => img.thumbnailUrl
        );
  
        setLocalPreviews(existingPreviews);
      }
    }
  }, [initialData, form]);
 const onFormSubmit = async (data: VehicleFormData) => {
  try {

    let uploadedImages = data.image_gallery || [];

    if (vehicleFiles.length > 0) {

      const newUploads = await Promise.all(
        vehicleFiles.map(async (file) => {
          const uploaded = await uploadToImageKit(file);

          // Runtime validation (safe)
          if (
            !uploaded.fileId ||
            !uploaded.url ||
            !uploaded.thumbnailUrl ||
            !uploaded.name ||
            !uploaded.size ||
            !uploaded.filePath
          ) {
            throw new Error("Invalid ImageKit upload response");
          }

          return {
            fileId: uploaded.fileId,
            url: uploaded.url,
            thumbnailUrl: uploaded.thumbnailUrl,
            name: uploaded.name,
            size: uploaded.size,
            filePath: uploaded.filePath,
          };
        })
      );

      uploadedImages = [...uploadedImages, ...newUploads];
    }

    await onSubmit({
      ...data,
      image_gallery: uploadedImages,
    });

  } catch (e) {
    console.error("Submit failed", e);
  }
};



  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Enter the vehicle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* VIN */}
              <FormField
                control={control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1HGBH41JXMN109186"
                        maxLength={17}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock Number */}
              <FormField
                control={control}
                name="stock_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Number</FormLabel>
                    <FormControl>
                      <Input placeholder="H001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year */}
              <FormField
                control={control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1900}
                        max={new Date().getFullYear() + 1}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Make */}
              <FormField
                control={control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make *</FormLabel>
                    <FormControl>
                      <Input placeholder="Honda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model *</FormLabel>
                    <FormControl>
                      <Input placeholder="Civic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trim */}
              <FormField
                control={control}
                name="trim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trim</FormLabel>
                    <FormControl>
                      <Input placeholder="EX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Odometer */}
              <FormField
                control={control}
                name="odometer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odometer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Condition (Select) */}
              <FormField
                control={control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                        <SelectItem value="Certified Pre-Owned">
                          Certified Pre-Owned
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status (Select) */}
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
  control={control}
  name="image_gallery"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Vehicle Images</FormLabel>
      <FormControl>
        <div className="space-y-3">

          {/* Local Preview Uploader */}
          <ImageUploader
  multiple
  onFilesChange={(files) => {
    setVehicleFiles(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setLocalPreviews(previews);
  }}
/>

{/* Newly Selected Images */}
<div className="flex flex-wrap gap-3">
  {localPreviews.map((src, index) => (
    <div
      key={index}
      className="relative w-24 h-24 rounded-md overflow-hidden border"
    >
      <Image
      width={50}
      height={50}
        src={src}
        className="w-full h-full object-cover"
        alt="Preview"
      />

      <button
        type="button"
        onClick={() => {
          const updatedFiles = vehicleFiles.filter((_, i) => i !== index);
          const updatedPreviews = localPreviews.filter((_, i) => i !== index);

          setVehicleFiles(updatedFiles);
          setLocalPreviews(updatedPreviews);
        }}
        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded"
      >
        ✕
      </button>
    </div>
  ))}
</div>


        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Information</CardTitle>
            <CardDescription>Enter purchase and retail pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Purchase Price */}
              <FormField
                control={control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Retail Price */}
              <FormField
                control={control}
                name="retail_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retail Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Extra Costs */}
              <FormField
                control={control}
                name="extra_costs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra Costs</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Taxes */}
              <FormField
                control={control}
                name="taxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Financial Calculations Display */}
            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-3 font-semibold">Financial Summary</h4>
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Grand Total Value
                  </p>
                  <p className="text-lg font-semibold">
                    ${grandTotalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Purchase + Extra Costs + Taxes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gross Profit</p>
                  <p
                    className={`text-lg font-semibold ${
                      grossProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${grossProfit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Retail - Grand Total
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Income
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      estimatedIncome >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${estimatedIncome.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Retail - Grand Total
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    "Save Vehicle"
  )}
</Button>


        </div>
      </form>
    </Form>
  );
}