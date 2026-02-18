// // For development before AdSense approval
// interface AdPlaceholderProps {
//   size?: 'small' | 'medium' | 'large' | 'responsive';
//   className?: string;
// }

// export default function AdPlaceholder({ size = 'small', className = '' }: AdPlaceholderProps) {
//   const dimensions = {
//     small: '300x250',
//     medium: '728x90',
//     large: '970x250',
//     responsive: 'auto'
//   }[size];

//   const heightClass = size === 'small' ? 'min-h-[250px]' : 'min-h-[120px]';

//   return (
//     <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden my-0 ${className} ${heightClass}`}>
//       <div className="text-xs text-gray-500 p-2 text-center border-b border-gray-200 dark:border-gray-600">
//         Advertisement
//       </div>
//       <div className="flex items-center justify-center p-4 text-gray-500 text-sm h-full">
//         <div className="text-center">
//           <div className="text-lg mb-1">Ad Space</div>
//           <div className="text-xs">{dimensions}</div>
//           <div className="text-xs mt-1 text-gray-400">(Single Column)</div>
//         </div>
//       </div>
//     </div>
//   );
// }