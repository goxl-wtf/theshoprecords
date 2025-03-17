import React from 'react';
import Image from 'next/image';
import { Image as ImageType } from '../../../utils/types';

export interface ImageThumbnailsProps {
  images: ImageType[];
  activeImage: string | null;
  onThumbnailClick: (imageUrl: string) => void;
  alt: string;
}

/**
 * ImageThumbnails component displays a grid of product image thumbnails
 * 
 * @param {ImageThumbnailsProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ImageThumbnails: React.FC<ImageThumbnailsProps> = ({ 
  images, 
  activeImage, 
  onThumbnailClick,
  alt 
}) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {images.slice(0, 5).map((image) => (
        <button
          key={image.id}
          onClick={() => onThumbnailClick(image.url)}
          className={`relative aspect-square rounded-md overflow-hidden ${
            activeImage === image.url ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200 dark:ring-dark-300'
          }`}
          aria-label={`View ${alt} image ${images.indexOf(image) + 1}`}
        >
          <Image 
            src={image.url} 
            alt={`${alt} thumbnail`} 
            fill
            sizes="(max-width: 768px) 20vw, 10vw"
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
};

export default ImageThumbnails; 