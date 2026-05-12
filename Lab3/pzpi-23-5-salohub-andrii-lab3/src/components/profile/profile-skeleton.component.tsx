const ProfileSkeleton = () => {
  return (
    <div className='container max-w-3xl mx-auto py-10'>
      <div className='animate-pulse space-y-4'>
        <div className='h-8 bg-gray-200 rounded w-1/3' />
        <div className='h-32 bg-gray-200 rounded' />
        <div className='h-32 bg-gray-200 rounded' />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
