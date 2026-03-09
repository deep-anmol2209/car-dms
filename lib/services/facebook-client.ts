'use client';

import { postVehicleToFacebook } from '@/lib/services/facebook';

// Client-side wrapper for Facebook posting
export async function postVehicleToFacebookClient(vehicleId: string) {
  const response = await fetch('/api/facebook/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vehicleId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to post to Facebook');
  }

  return response.json();
}
