'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export interface FilterItem {
  id: string;
  name: string;
  count?: number;
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selectedItems: string[];
  onItemSelect: (itemId: string) => void;
  onItemRemove: (itemId: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  items,
  selectedItems,
  onItemSelect,
  onItemRemove,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onItemRemove(itemId);
    } else {
      onItemSelect(itemId);
    }
  };

  return (
    <div className="mb-6">
      <button
        className="flex items-center justify-between w-full py-2 font-medium text-sm text-gray-900 dark:text-white"
        onClick={toggleSection}
      >
        <span>{title}</span>
        {isOpen ? (
          <FiChevronUp className="h-4 w-4" />
        ) : (
          <FiChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 space-y-1.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center">
              <button
                onClick={() => toggleItem(item.id)}
                className={`flex items-center text-sm py-1 px-2 rounded-full transition-colors ${
                  selectedItems.includes(item.id)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="mr-1.5">{item.name}</span>
                {item.count !== undefined && (
                  <span className={`text-xs ${selectedItems.includes(item.id) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    ({item.count})
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection; 