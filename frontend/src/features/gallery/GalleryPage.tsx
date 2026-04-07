import useGetImages from "./hooks/useGetImages";

const GalleryPage = () => {
  const { data: images, error } = useGetImages();

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  console.log(images);
  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-slate-700">Gallery</h1>

      <p className="text-gray-600 mt-2 mb-3 border-b border-gray-200 pb-2">Showing {images?.length} images</p>

      <div className="grid grid-cols-5 gap-4">
        {images?.map((img) => (
          <a key={img.id} href={img.url} target="_blank" rel="noreferrer">
            <div key={img.id} className="h-44 p-2 border border-gray-300 rounded-lg overflow-hidden shadow bg-white">
              <img
                className="h-full w-full object-contain transition-transform duration-300 hover:scale-110 ease-in-out"
                src={img.url}
                alt={img.originalFilename}
              />
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default GalleryPage;
