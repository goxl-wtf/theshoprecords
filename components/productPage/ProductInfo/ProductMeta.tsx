import React from 'react';
import { Genre, Style } from '../../../utils/types';

export interface ProductMetaProps {
  genres?: Genre[];
  styles?: Style[];
}

/**
 * ProductMeta component displays product genres and styles
 * 
 * @param {ProductMetaProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ProductMeta: React.FC<ProductMetaProps> = ({ genres, styles }) => {
  return (
    <div className="flex flex-col gap-2">
      {genres && genres.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Genres:</span>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <span 
                key={genre.id} 
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {styles && styles.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Styles:</span>
          <div className="flex flex-wrap gap-2">
            {styles.map(style => (
              <span 
                key={style.id} 
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {style.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMeta; 