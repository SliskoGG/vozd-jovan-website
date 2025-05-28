import { NextResponse } from 'next/server';
import { contentfulClient } from '@/lib/contentful';

export async function GET() {
  try {
    // Test the connection
    const response = await contentfulClient.getEntries({
      content_type: 'album',
      limit: 1
    });
    
    return NextResponse.json({
      success: true,
      message: 'Contentful connection working!',
      albumCount: response.items.length,
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      hasAccessToken: !!process.env.CONTENTFUL_ACCESS_TOKEN,
      firstAlbum: response.items[0] ? {
        id: response.items[0].sys.id,
        title: response.items[0].fields.title
      } : null
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      hasAccessToken: !!process.env.CONTENTFUL_ACCESS_TOKEN
    }, { status: 500 });
  }
}
