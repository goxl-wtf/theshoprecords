'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiCheckCircle, FiCircle } from 'react-icons/fi';

interface FilterItem {
  id: string;
  name: string;
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selectedItems: string[];
  onItemSelect: (id: string) => void;
  onItemRemove: (id: string) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
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

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      onItemRemove(id);
    } else {
      onItemSelect(id);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-dark-100 pb-6 last:border-0 last:pb-0">
      <button
        className="w-full flex justify-between items-center py-2 focus:outline-none group"
        onClick={toggleSection}
      >
        <h3 className="text-md font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <span className="text-gray-500 dark:text-gray-400">
          {isOpen ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
        </span>
      </button>

      <div
        className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pl-1 flex flex-wrap gap-2 mt-3">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`
                  flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-primary bg-opacity-10 text-primary border-primary'
                      : 'bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-50'
                  }
                `}
              >
                <span className="mr-1.5">
                  {isSelected ? (
                    <FiCheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <FiCircle className="h-4 w-4" />
                  )}
                </span>
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Price range slider component (can be expanded later)
export const PriceRangeSlider = () => {
  return <div>Price Range Slider (To be implemented)</div>;
};

export const FilterComponents = {
  FilterSection,
  PriceRangeSlider
};

export default FilterComponents; 