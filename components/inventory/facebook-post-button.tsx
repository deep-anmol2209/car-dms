'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Loader2 } from 'lucide-react';
import { postVehicleToFacebookClient } from '@/lib/services/facebook-client';
import { toast } from 'react-hot-toast';

export function FacebookPostButton({ vehicleId }: { vehicleId: string }) {
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!confirm('Post this vehicle to Facebook?')) return;

    setPosting(true);
    try {
      const result = await postVehicleToFacebookClient(vehicleId);
      if (result.success) {
        toast.success('Vehicle posted to Facebook successfully!');
      } else {
        toast.error(result.error || 'Failed to post to Facebook');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to post to Facebook');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePost}
      disabled={posting}
      className="w-full justify-start"
    >
      {posting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Share2 className="w-4 h-4 mr-2" />
      )}
      Post to Facebook
    </Button>
  );
}
