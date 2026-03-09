'use client';

import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteInventory } from '@/hooks/use-inventory';
import { FacebookPostButton } from './facebook-post-button';
import toast from 'react-hot-toast';

export function VehicleActionsMenu({ vehicleId }: { vehicleId: string }) {
  console.log(vehicleId);
  const deleteInventory = useDeleteInventory();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/inventory/${vehicleId}`)}>
          <Pencil className="w-4 h-4 mr-2"  />
          Edit
        </DropdownMenuItem>

         <DropdownMenuItem onClick={() => router.push(`/inventory/view/${vehicleId}`)}>
          <Pencil className="w-4 h-4 mr-2"  />
         View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          deleteInventory.mutate({id: vehicleId}, {
            onSuccess: () => {
              toast.success('Vehicle deleted');
              router.back();
            },
            onError: () => {
              toast.error('Failed to delete vehicle');
            },
          })


        }} className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" onClick={() => deleteInventory.mutate({id: vehicleId}, {
            onSuccess: () => {
              toast.success('Vehicle deleted');
              router.back();
            },
            onError: () => {
              toast.error('Failed to delete vehicle');
            },
          })} />
          Delete
        </DropdownMenuItem>
        <div className="px-2 py-1.5">
          <FacebookPostButton vehicleId={vehicleId} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
