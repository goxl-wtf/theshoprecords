import React from 'react';
import { Genre, Style } from '../utils/types';

interface SidebarProps {
  genres: Genre[];
  styles: Style[];
  selectedGenre: string | null;
  selectedStyle: string | null;
  onGenreSelect: (genreId: string | null) => void;
  onStyleSelect: (styleId: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  genres,
  styles,
  selectedGenre,
  selectedStyle,
  onGenreSelect,
  onStyleSelect,
}) => {
  return (
    <div className="bg-white dark:bg-dark-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-light-100">Filters</h3>
      
      {/* Genre Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 text-gray-800 dark:text-light-200">Genres</h4>
        <ul className="space-y-2">
          <li>
            <button
              className={`text-left w-full ${
                !selectedGenre 
                  ? 'font-medium text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
              }`}
              onClick={() => onGenreSelect(null)}
            >
              All Genres
            </button>
          </li>
          {genres.map((genre) => (
            <li key={genre.id}>
              <button
                className={`text-left w-full ${
                  selectedGenre === genre.id
                    ? 'font-medium text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                }`}
                onClick={() => onGenreSelect(genre.id)}
              >
                {genre.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Style Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 text-gray-800 dark:text-light-200">Styles</h4>
        <ul className="space-y-2">
          <li>
            <button
              className={`text-left w-full ${
                !selectedStyle 
                  ? 'font-medium text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
              }`}
              onClick={() => onStyleSelect(null)}
            >
              All Styles
            </button>
          </li>
          {styles.map((style) => (
            <li key={style.id}>
              <button
                className={`text-left w-full ${
                  selectedStyle === style.id
                    ? 'font-medium text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                }`}
                onClick={() => onStyleSelect(style.id)}
              >
                {style.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Condition Filter - could be added later */}
      <div>
        <h4 className="font-medium mb-2 text-gray-800 dark:text-light-200">Condition</h4>
        <ul className="space-y-2">
          <li>
            <button className="text-left w-full text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              All Conditions
            </button>
          </li>
          <li>
            <button className="text-left w-full text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              Mint (M)
            </button>
          </li>
          <li>
            <button className="text-left w-full text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              Near Mint (NM)
            </button>
          </li>
          <li>
            <button className="text-left w-full text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              Very Good Plus (VG+)
            </button>
          </li>
          <li>
            <button className="text-left w-full text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              Very Good (VG)
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 