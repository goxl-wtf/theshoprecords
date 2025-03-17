import React from 'react';
import { Track } from '../../../utils/types';

export interface TrackListProps {
  tracks: Track[];
}

/**
 * TrackList component displays the product tracks in a table
 * 
 * @param {TrackListProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  if (tracks.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No track listing available for this product.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-300">
        <thead className="bg-gray-50 dark:bg-dark-300">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-dark-300">
          {tracks.map((track) => (
            <tr key={track.id} className="hover:bg-gray-50 dark:hover:bg-dark-300">
              <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{track.position}</td>
              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">{track.title}</td>
              <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{track.duration || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList; 