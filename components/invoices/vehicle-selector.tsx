"use client";

import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/inventory";

interface Props {
  vehicles: Vehicle[];
  value?: string;
  onChange: (vehicle: Vehicle) => void;
  onSearch?: (value: string) => void; 
}

export function VehicleSelector({ vehicles, value, onChange , onSearch}: Props) {
  const [open, setOpen] = useState(false);

  const selected = vehicles.find(v => v.id === value);

 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected
            ? `${selected.year} ${selected.make} ${selected.model}`
            : "Select vehicle"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search vehicle..."
          onValueChange={(val) => onSearch?.(val)} // 👈 IMPORTANT
          />

          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No vehicle found</CommandEmpty>

            {vehicles.map((v) => (
              <CommandItem
                key={v.id}
                onSelect={() => {
                  onChange(v);
                  setOpen(false);
                }}
              >
                {v.year} {v.make} {v.model}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}