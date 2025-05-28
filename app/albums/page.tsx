import { getAlbums } from '@/lib/contentful';

export default async function AlbumsPage() {
  const albums = await getAlbums();
  
  // Debug information
  console.log('Albums count:', albums.length);
  if (albums.length > 0) {
    console.log('First album fields:', Object.keys(albums[0].fields));
    console.log('First album title:', albums[0].fields.title);
    console.log('Cover Image field:', albums[0].fields.coverImage || albums[0].fields['Cover Image']);
    console.log('Release Date field:', albums[0].fields.releaseDate || albums[0].fields['Release Date']);
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Albums</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.length > 0 ? (
          <pre className="bg-zinc-800 p-4 rounded text-xs text-white overflow-auto">
            {JSON.stringify(albums[0], null, 2)}
          </pre>
        ) : (
          <div className="col-span-3 text-center">
            <p className="text-xl mb-4">No albums found.</p>
            <p className="text-zinc-400">Add some albums in your Contentful dashboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}
