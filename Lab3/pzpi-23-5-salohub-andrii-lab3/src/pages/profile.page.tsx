import { useProfileQuery } from '@/queries/users.queries';
import { useMyStatsQuery } from '@/queries/users.queries';
import EditProfileForm from '@/components/profile/edit-profile.component';
import ProfileSkeleton from '@/components/profile/profile-skeleton.component';
import ProfileStats from '@/components/profile/profile-stats.component';
import ProfileInfo from '@/components/profile/profile-info.component';

const ProfilePage = () => {
  const { data: profileData, isLoading } = useProfileQuery();
  const { data: statsData } = useMyStatsQuery();

  const profile = profileData?.data;
  const stats = statsData?.data;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className='container max-w-3xl mx-auto py-10 space-y-6'>
      <ProfileStats stats={stats} />
      <ProfileInfo profile={profile} />
      <EditProfileForm profile={profileData?.data!} />
    </div>
  );
};

export default ProfilePage;
