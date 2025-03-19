import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export interface DescriptionProps {
  description?: string;
}

/**
 * Description component displays the product description with read more/less functionality
 * 
 * @param {DescriptionProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const Description: React.FC<DescriptionProps> = ({ description }) => {
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  
  // Check if description is long enough to need truncating
  const isDescriptionLong = description && description.length > 300;
  
  // Truncate description for collapsed view
  const getShortDescription = () => {
    if (!description) return '';
    
    const maxChars = 300;
    if (description.length <= maxChars) return description;
    
    // Find the last space before maxChars to avoid cutting words
    const lastSpace = description.substring(0, maxChars).lastIndexOf(' ');
    return description.substring(0, lastSpace) + '...';
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div className="relative">
        <div className="text-gray-700 dark:text-gray-300">
          {isDescriptionLong ? (
            <>
              {showFullDescription ? (
                <p>{description}</p>
              ) : (
                <>
                  <p>{getShortDescription()}</p>
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white dark:from-dark-100 to-transparent pointer-events-none"></div>
                </>
              )}
            </>
          ) : (
            <p>{description}</p>
          )}
        </div>
        
        {/* Read more button - only if description is long */}
        {isDescriptionLong && (
          <button 
            type="button"
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="w-full py-2 mt-2 bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300 rounded-md flex justify-center items-center text-gray-600 dark:text-gray-400 transition-colors"
            aria-expanded={showFullDescription}
          >
            {showFullDescription ? (
              <>
                <FiChevronUp className="mr-2" />
                <span>Show less</span>
              </>
            ) : (
              <>
                <FiChevronDown className="mr-2" />
                <span>Read more</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Description; 