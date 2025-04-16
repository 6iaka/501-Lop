export async function getYouTubeSubscriptions(accessToken: string) {
  try {
    console.log('Making YouTube API request with token:', accessToken.substring(0, 10) + '...');
    
    let allSubscriptions: any[] = [];
    let nextPageToken: string | undefined;
    
    do {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,id&mine=true&maxResults=50&order=alphabetical${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      console.log('YouTube API Response Status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('YouTube API Error:', errorData);
        throw new Error(`YouTube API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('YouTube API Response Data:', JSON.stringify(data, null, 2));

      if (data.items && data.items.length > 0) {
        allSubscriptions = [...allSubscriptions, ...data.items];
      }

      nextPageToken = data.nextPageToken;
      if (nextPageToken) {
        console.log('Fetching next page with token:', nextPageToken);
      }
    } while (nextPageToken);

    console.log(`Total subscriptions fetched: ${allSubscriptions.length}`);

    // Fetch channel details for each subscription
    const channelDetailsPromises = allSubscriptions.map(async (item) => {
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${item.snippet.resourceId.channelId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!channelResponse.ok) {
        console.error('Failed to fetch channel details for:', item.snippet.title);
        return null;
      }

      const channelData = await channelResponse.json();
      return channelData.items?.[0] || null;
    });

    const channelDetails = await Promise.all(channelDetailsPromises);

    // Sort alphabetically by channel name
    const sortedSubscriptions = allSubscriptions
      .map((item: any) => {
        const thumbnailUrl = item.snippet.thumbnails.high?.url || 
                           item.snippet.thumbnails.medium?.url || 
                           item.snippet.thumbnails.default.url;
        
        // Use our proxy for the image URL
        const proxiedImageUrl = thumbnailUrl ? `/api/proxy-image?url=${encodeURIComponent(thumbnailUrl)}` : null;
        
        return {
          id: item.id,
          channelId: item.snippet.resourceId.channelId,
          name: item.snippet.title,
          imageUrl: proxiedImageUrl || `https://via.placeholder.com/800x200/333333/ffffff?text=${encodeURIComponent(item.snippet.title)}`,
          description: item.snippet.description,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log('Processed subscriptions:', JSON.stringify(sortedSubscriptions, null, 2));
    return sortedSubscriptions;
  } catch (error: any) {
    console.error('Error in getYouTubeSubscriptions:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    throw error;
  }
}

export async function unsubscribeFromChannel(accessToken: string, subscriptionId: string) {
  try {
    console.log('Unsubscribing from subscription:', subscriptionId);
    
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/subscriptions?id=${subscriptionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Unsubscribe Response Status:', response.status);
    console.log('Unsubscribe Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Unsubscribe Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Failed to unsubscribe: ${errorData.error?.message || response.statusText}`);
    }

    return true;
  } catch (error: any) {
    console.error('Error in unsubscribeFromChannel:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    throw error;
  }
} 