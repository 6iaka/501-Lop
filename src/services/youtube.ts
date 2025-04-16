export async function getYouTubeSubscriptions(accessToken: string) {
  try {
    console.log('Making YouTube API request with token:', accessToken.substring(0, 10) + '...');
    
    let allSubscriptions: any[] = [];
    let nextPageToken: string | undefined;
    
    do {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50&order=alphabetical${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`,
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
        id: item.snippet.resourceId.channelId,
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