import { createClient } from 'contentful';

// This is the Contentful client that will fetch your content
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Function to get all albums
export async function getAlbums() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'album',
      order: '-fields.releaseDate', // Most recent first
    });
    
    return response.items;
  } catch (error) {
    console.error('Error fetching albums from Contentful:', error);
    return [];
  }
}

// Function to get a single album by ID
export async function getAlbumById(id: string) {
  try {
    const album = await contentfulClient.getEntry(id);
    return album;
  } catch (error) {
    console.error(`Error fetching album with ID ${id}:`, error);
    return null;
  }
}

// Function to get all blog posts
export async function getBlogPosts() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      order: '-fields.publicationDate', // Most recent first
    });
    
    return response.items;
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    return [];
  }
}

// Function to get a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    });
    
    return response.items[0] || null;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}
