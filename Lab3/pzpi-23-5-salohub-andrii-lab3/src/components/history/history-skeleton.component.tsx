const HistorySkeleton = () => {
  return (
    <div className='container max-w-4xl mx-auto py-10 space-y-4'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='h-28 bg-gray-100 animate-pulse rounded-xl' />
      ))}
    </div>
  );
};

export default HistorySkeleton;
