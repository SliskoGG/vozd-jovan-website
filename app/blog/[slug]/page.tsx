import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/blog" className="text-zinc-400 hover:text-white mb-6 inline-block">
        ← Back to all posts
      </Link>
      
      <h1 className="text-4xl font-bold mb-4">{post.fields.title}</h1>
      
      <div className="text-zinc-400 mb-8">
        {new Date(post.fields.publicationDate).toLocaleDateString()} • {post.fields.author}
      </div>
      
      {post.fields.featuredImage && (
        <div className="relative h-96 w-full mb-8">
          <Image 
            src={`https:${post.fields.featuredImage.fields.file.url}`}
            alt={post.fields.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="prose prose-invert max-w-none">
        {documentToReactComponents(post.fields.content)}
      </div>
      
      {post.fields.tags && post.fields.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.fields.tags.map((tag: string) => (
              <span key={tag} className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
