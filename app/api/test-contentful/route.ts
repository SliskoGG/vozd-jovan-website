import { NextResponse } from 'next/server';
import { contentfulClient } from '@/lib/contentful';

export async function GET() {
  try {
    // Test albums
    const albumResponse = await contentfulClient.getEntries({
      content_type: 'album',
      limit: 5
    });
    
    // Test blog posts
    const blogResponse = await contentfulClient.getEntries({
      content_type: 'blogPost',
      limit: 5
    });
    
    return NextResponse.json({
      success: true,
      message: 'Contentful connection working!',
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      hasAccessToken: !!process.env.CONTENTFUL_ACCESS_TOKEN,
      albums: {
        count: albumResponse.items.length,
        items: albumResponse.items.map(item => ({
          id: item.sys.id,
          title: item.fields.title,
          releaseDate: item.fields.releaseDate,
          hasDescription: !!item.fields.description,
          hasTracklist: !!item.fields.tracklist,
          hasCoverImage: !!item.fields.coverImage,
          coverImageStructure: item.fields.coverImage ? 'present' : 'missing',
          allFields: Object.keys(item.fields)
        }))
      },
      blogPosts: {
        count: blogResponse.items.length,
        items: blogResponse.items.map(item => ({
          id: item.sys.id,
          title: item.fields.title,
          slug: item.fields.slug,
          publicationDate: item.fields.publicationDate,
          author: item.fields.author,
          hasContent: !!item.fields.content,
          hasFeaturedImage: !!item.fields.featuredImage,
          allFields: Object.keys(item.fields)
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorDetails: error.toString()
    }, { status: 500 });
  }
}
