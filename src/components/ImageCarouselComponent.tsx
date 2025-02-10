import { useState } from 'react';
import { ImageCarousel } from '../lib/ImageCarousel';

export const ImageCarouselComponent = () => {
  const [carousel] = useState(() => new ImageCarousel());
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const addImage = () => {
    const url = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200`;
    carousel.addImage(url);
    setCurrentImage(carousel.getCurrentImage());
  };

  const showNext = () => {
    setCurrentImage(carousel.nextImage());
  };

  const showPrev = () => {
    setCurrentImage(carousel.prevImage());
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Image Carousel</h2>
      {currentImage && (
        <div className="mb-4">
          <img
            src={currentImage}
            alt="Carousel"
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={addImage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Image
        </button>
        <button
          onClick={showPrev}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={showNext}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}; 