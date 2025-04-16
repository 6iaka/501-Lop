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
      console.log('YouTube API Response Page Data:', {
        pageInfo: data.pageInfo,
        itemsCount: data.items?.length,
        hasNextPage: !!data.nextPageToken,
        totalResults: data.pageInfo?.totalResults,
        resultsPerPage: data.pageInfo?.resultsPerPage
      });

      if (data.items && data.items.length > 0) {
        allSubscriptions = [...allSubscriptions, ...data.items];
      }

      nextPageToken = data.nextPageToken;
      if (nextPageToken) {
        console.log('Fetching next page with token:', nextPageToken);
      }
    } while (nextPageToken);

    console.log(`Total subscriptions fetched: ${allSubscriptions.length}`);

    // Sort alphabetically by channel name
    const sortedSubscriptions = allSubscriptions
      .map((item: any) => ({
        id: item.id,
        channelId: item.snippet.resourceId.channelId,
        name: item.snippet.title,
        imageUrl: item.snippet.thumbnails.default.url,
        description: item.snippet.description,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

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