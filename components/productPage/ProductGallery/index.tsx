import React, { useState } from 'react';
import { Image as ImageType } from '../../../utils/types';
import ProductImage from './ProductImage';
import ImageThumbnails from './ImageThumbnails';

export interface ProductGalleryProps {
  images: ImageType[];
  title: string;
}

/**
 * ProductGallery component displays the main product image and thumbnails
 * 
 * @param {ProductGalleryProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState<string | null>(
    images && images.length > 0 ? images[0].url : null
  );

  const handleThumbnailClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  return (
    <div>
      <ProductImage 
        imageUrl={activeImage} 
        alt={title} 
      />
      
      {images && images.length > 1 && (
        <ImageThumbnails 
          images={images} 
          activeImage={activeImage}
          onThumbnailClick={handleThumbnailClick}
          alt={title}
        />
      )}
    </div>
  );
};

export default ProductGallery; 