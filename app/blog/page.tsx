import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/contentful';

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.sys.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              {post.fields.featuredImage && (
                <div className="relative h-64 w-full">
                  <Image 
                    src={`https:${post.fields.featuredImage.fields.file.url}`}
                    alt={post.fields.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{post.fields.title}</h2>
                <p className="text-zinc-400 mb-4">
                  {new Date(post.fields.publicationDate).toLocaleDateString()} • {post.fields.author}
                </p>
                
                <Link 
                  href={`/blog/${post.fields.slug}`}
                  className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-2">No blog posts found. Add some in Contentful!</p>
        )}
      </div>
    </div>
  );
}
