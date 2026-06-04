export default function Loading() {
  return (
    <div className="animate-pulse w-full">
      
      <div className="flex justify-between items-center mb-5">
        <div>
          
          <div className="h-9 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
          
          <div className="h-5 w-72 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      </div>

      
      <div className="mt-5 grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="h-[104px] w-full bg-gray-200 dark:bg-gray-800 rounded-xl"
          ></div>
        ))}
      </div>

      
      <div className="mt-6 flex items-center justify-between">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-10 w-80 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      
      <div className="mt-4 w-full border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
        
        <div className="h-12 bg-gray-100 dark:bg-gray-900 w-full"></div>
        
        {[1, 2, 3, 4, 5].map((row) => (
          <div 
            key={row} 
            className="h-16 w-full bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700"
          ></div>
        ))}
      </div>

      
      <div className="mt-6 flex justify-center">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      </div>
    </div>
  );
}