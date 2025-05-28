import Image from "next/image"
import { getAlbums } from "@/lib/contentful"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

export default async function AlbumsPage() {
  const albums = await getAlbums()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Albums</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.length > 0 ? (
          albums.map((album: any) => (
            <div key={album.sys.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              {/* Cover Image - Handle Array Structure */}
              {album.fields.coverImage &&
                Array.isArray(album.fields.coverImage) &&
                album.fields.coverImage.length > 0 && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={`https:${album.fields.coverImage[0].fields.file.url}`}
                      alt={album.fields.title || "Album cover"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{album.fields.title}</h2>
                <p className="text-zinc-400 mb-4">
                  Released:{" "}
                  {album.fields.releaseDate ? new Date(album.fields.releaseDate).toLocaleDateString() : "Date not set"}
                </p>

                {/* Description */}
                {album.fields.description && (
                  <div className="prose prose-invert max-w-none mb-4 text-sm">
                    {documentToReactComponents(album.fields.description)}
                  </div>
                )}

                {/* Tracklist */}
                {album.fields.tracklist && (
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Tracklist</h3>
                    <div className="prose prose-invert max-w-none text-sm">
                      {documentToReactComponents(album.fields.tracklist)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center">
            <p className="text-xl mb-4">No albums found.</p>
            <p className="text-zinc-400">Add some albums in your Contentful dashboard!</p>
          </div>
        )}
      </div>
    </div>
  )
}
