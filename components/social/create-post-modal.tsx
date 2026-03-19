"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Facebook, Loader2, Search } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ open, onClose }: Props) {
  const supabase = createClient();

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------------- FETCH VEHICLES ---------------- */

  useEffect(() => {
    if (!open) return;

    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, make, model, year, trim, retail_price, image_gallery")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        toast.error("Failed to load vehicles");
        return;
      }
      setVehicles(data || []);
    };

    fetchVehicles();
  }, [open, supabase]);

  /* ---------------- SELECTION ---------------- */

  const handleSelectVehicle = (v: any) => {
    setSelectedVehicle(v);

    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v.retail_price || 0);

    const generatedCaption = `Just Arrived! 🚗\n\n${v.year} ${v.make} ${v.model}${
      v.trim ? ` ${v.trim}` : ""
    }\n💰 Price: ${formattedPrice}\n\nContact us today for more information! ✨\n\n#UsedCars #${v.make} #${v.model} #CarSales`;

    setCaption(generatedCaption);
  };

  /* ---------------- POST ---------------- */

  const handlePost = async () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          caption, // ✅ send caption also
          platform: "facebook", // ✅ fixed platform
        }),
      });

      if (res.ok) {
        toast.success("Posted to Facebook successfully!");
        onClose();
        setSelectedVehicle(null);
        setCaption("");
      } else {
        toast.error("Failed to post");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) =>
      `${v.make} ${v.model} ${v.year}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  /* ---------------- IMAGES ---------------- */

  const images =
    selectedVehicle?.image_gallery?.map((img: string) => {
      try {
        return JSON.parse(img).url;
      } catch {
        return img;
      }
    }) || [];

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-600" />
            Create Facebook Post
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* LEFT */}
          <div className="space-y-4">
            <label className="text-sm font-semibold">1. Select Vehicle</label>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <ScrollArea className="h-[300px] border rounded-md">
              <div className="p-2 space-y-2">
                {filteredVehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVehicle(v)}
                    className={`w-full p-3 border rounded ${
                      selectedVehicle?.id === v.id ? "border-blue-500" : ""
                    }`}
                  >
                    {v.year} {v.make} {v.model}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <label className="text-sm font-semibold">2. Preview</label>

            {selectedVehicle ? (
              <>
                {/* Images */}
                <div className="grid grid-cols-2 gap-2">
                  {images.map((img: string, i: number) => (
                    <div key={i} className="relative aspect-video">
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>

                {/* Caption */}
                <Textarea
                  rows={8}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                Select vehicle
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>

          <Button onClick={handlePost} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Post to Facebook"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}