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

  const pageId = process.env.FACEBOOK_PAGE_ID!;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;
  const apiUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;

  if (!pageId || !accessToken) {
    throw new Error('Facebook credentials missing in environment variables');
  }
  // Construct marketing caption
  const caption = `Just Arrived! ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}

💰 Price: $${parseFloat(vehicle.retail_price?.toString() || '0').toLocaleString()}
📏 Odometer: ${vehicle.odometer?.toLocaleString() || 'N/A'} miles
🔧 Condition: ${vehicle.condition || 'Used'}

${vehicle.vin ? `VIN: ${vehicle.vin}` : ''}

Contact us today for more information! 🚗✨

#UsedCars #${vehicle.make} #${vehicle.model} #CarDealer`;

let imageUrls: string[] = [];

if (Array.isArray(vehicle.image_gallery)) {
  imageUrls = vehicle.image_gallery.map((img: string) => {
    try {
      const parsed = JSON.parse(img);
      return parsed.url;
    } catch {
      return img;
    }
  }).filter(Boolean);
}

  try {
    const postData: Record<string, string> = {
      message: caption,
      access_token: accessToken,
    };

    // Add photo if available
    if (imageUrls.length > 0) {
      const uploadedMediaIds: string[] = [];
    
      // Step 1: Upload all images (unpublished)
      for (const url of imageUrls) {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${pageId}/photos`,
          {
            method: "POST",
            body: new URLSearchParams({
              url,
              published: "false",
              access_token: accessToken,
            }),
          }
        );
    
        const data = await res.json();
    
        if (data.id) {
          uploadedMediaIds.push(data.id);
        } else {
          console.error("Image upload failed:", data);
        }
      }
    
      // Step 2: Create post with all images
      const attached_media = uploadedMediaIds.map((id) => ({
        media_fbid: id,
      }));
    
      const postRes = await fetch(apiUrl, {
        method: "POST",
        body: new URLSearchParams({
          message: caption,
          attached_media: JSON.stringify(attached_media),
          access_token: accessToken,
        }),
      });
    
      const postData = await postRes.json();
    
      // Save
      await supabase.from("social_media_posts").insert({
        vehicle_id: vehicleId,
        platform: "Facebook",
        post_text: caption,
        image_urls: imageUrls,
        facebook_post_id: postData.id,
        status: "Published",
        published_at: new Date().toISOString(),
      });
    
      return {
        id: postData.id,
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

export async function getRecentFacebookPosts(limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('social_media_posts')
    .select(`
      id,
      vehicle_id,
      post_text,
      image_urls,
      facebook_post_id,
      status,
      published_at,
      vehicles (
        make,
        model,
        year
      )
    `)
    .eq('platform', 'Facebook')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }

  return data;
}