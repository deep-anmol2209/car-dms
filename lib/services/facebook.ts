'use server';

import { createClient } from '@/lib/supabase/server';

interface FacebookPostResponse {
  id: string;
  success: boolean;
  error?: string;
}

export async function postVehicleToFacebook(vehicleId: string): Promise<FacebookPostResponse> {
  const supabase = await createClient();
  
  // Fetch vehicle data
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .single();

  if (vehicleError || !vehicle) {
    throw new Error('Vehicle not found');
  }

  // Get Facebook page credentials
  const { data: fbAccount, error: fbError } = await supabase
    .from('facebook_business_account')
    .select('*')
    .eq('is_connected', true)
    .single();

  if (fbError || !fbAccount) {
    throw new Error('Facebook account not connected. Please connect in Settings.');
  }

  // Construct marketing caption
  const caption = `Just Arrived! ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}

💰 Price: $${parseFloat(vehicle.retail_price?.toString() || '0').toLocaleString()}
📏 Odometer: ${vehicle.odometer?.toLocaleString() || 'N/A'} miles
🔧 Condition: ${vehicle.condition || 'Used'}

${vehicle.vin ? `VIN: ${vehicle.vin}` : ''}

Contact us today for more information! 🚗✨

#UsedCars #${vehicle.make} #${vehicle.model} #CarDealer`;

  // Prepare image URL (use first image if available)
  const imageUrl = Array.isArray(vehicle.image_gallery) && vehicle.image_gallery.length > 0
    ? vehicle.image_gallery[0]
    : null;

  // Post to Facebook Graph API
  const pageId = fbAccount.page_id;
  const accessToken = fbAccount.access_token;
  const apiUrl = `https://graph.facebook.com/v18.0/${pageId}/feed`;

  try {
    const postData: Record<string, string> = {
      message: caption,
      access_token: accessToken,
    };

    // Add photo if available
    if (imageUrl) {
      // For photos, use photos endpoint
      const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      const photoResponse = await fetch(photoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      });

      if (!photoResponse.ok) {
        const errorData = await photoResponse.json();
        throw new Error(errorData.error?.message || 'Failed to post photo');
      }

      const photoData = await photoResponse.json();
      
      // Save to social_media_posts table
      const { error: postError } = await supabase.from('social_media_posts').insert({
        vehicle_id: vehicleId,
        platform: 'Facebook',
        post_text: caption,
        image_urls: imageUrl ? [imageUrl] : null,
        facebook_post_id: photoData.id,
        status: 'Published',
        published_at: new Date().toISOString(),
      });
      
      if (postError) {
        console.error('Failed to save social media post:', postError);
      }

      return {
        id: photoData.id,
        success: true,
      };
    } else {
      // Post text-only status
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to post to Facebook');
      }

      const data = await response.json();
      
      // Save to social_media_posts table
      const { error: postError } = await supabase.from('social_media_posts').insert({
        vehicle_id: vehicleId,
        platform: 'Facebook',
        post_text: caption,
        facebook_post_id: data.id,
        status: 'Published',
        published_at: new Date().toISOString(),
      });
      
      if (postError) {
        console.error('Failed to save social media post:', postError);
      }

      return {
        id: data.id,
        success: true,
      };
    }
  } catch (error: any) {
    // Save failed post attempt
    const { error: saveError } = await supabase.from('social_media_posts').insert({
      vehicle_id: vehicleId,
      platform: 'Facebook',
      post_text: caption,
      status: 'Failed',
    });
    
    if (saveError) {
      console.error('Failed to save failed post attempt:', saveError);
    }

    return {
      id: '',
      success: false,
      error: error.message,
    };
  }
}
