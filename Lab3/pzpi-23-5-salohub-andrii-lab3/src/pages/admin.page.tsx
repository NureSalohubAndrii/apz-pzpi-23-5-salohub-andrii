import { useAuthStore } from '@/store/auth.store';
import { AdminLayout } from '@/components/admin/admin-layout.component';
import { VerificationPanel } from '@/components/admin/moderator/verification-panel.component';
import { UsersPanel } from '@/components/admin/moderator/users-panel.component';
import { BackupsPanel } from '@/components/admin/db-admin/backups-panel.component';
import { LogsPanel } from '@/components/admin/super-admin/logs-panel.component';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, CheckSquare, Users, Activity, ShieldCheck } from 'lucide-react';
import { isDbAdmin, isModerator, isSuperAdmin } from '@/lib/roles';
import type { UserRole } from '@/types/auth.types';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { ManageAdminsPanel } from '@/components/admin/super-admin/manage-admins-panel.component';

const AdminPage = () => {
  const { t } = useTranslation();
  const role = useAuthStore(state => state.user?.role) as UserRole;

  const showModeratorTabs = isModerator(role) || isSuperAdmin(role);
  const showDbTabs = isDbAdmin(role) || isSuperAdmin(role);
  const showSuperAdminTabs = isSuperAdmin(role);

  return (
    <AdminLayout>
      {_ => (
        <Tabs defaultValue={showModeratorTabs ? 'verification' : 'database'}>
          <TabsList className='flex-wrap h-auto gap-1'>
            {showModeratorTabs && (
              <>
                <TabsTrigger value='verification' className='flex items-center gap-1'>
                  <CheckSquare className='w-4 h-4' /> {t(StringKey.VERIFICATION)}
                </TabsTrigger>
                <TabsTrigger value='users' className='flex items-center gap-1'>
                  <Users className='w-4 h-4' /> {t(StringKey.USERS)}
                </TabsTrigger>
              </>
            )}

            {showDbTabs && (
              <TabsTrigger value='database' className='flex items-center gap-1'>
                <Database className='w-4 h-4' /> {t(StringKey.DATABASE)}
              </TabsTrigger>
            )}

            {showSuperAdminTabs && (
              <>
                <TabsTrigger value='logs' className='flex items-center gap-1'>
                  <Activity className='w-4 h-4' /> {t(StringKey.LOGS)}
                </TabsTrigger>
                <TabsTrigger value='moderator-management' className='flex items-center gap-1'>
                  <ShieldCheck className='w-4 h-4' /> Management
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {showModeratorTabs && (
            <>
              <TabsContent value='verification' className='mt-6'>
                <VerificationPanel />
              </TabsContent>
              <TabsContent value='users' className='mt-6'>
                <UsersPanel />
              </TabsContent>
            </>
          )}

          {showDbTabs && (
            <TabsContent value='database' className='mt-6'>
              <BackupsPanel />
            </TabsContent>
          )}

          {showSuperAdminTabs && (
            <>
              <TabsContent value='logs' className='mt-6'>
                <LogsPanel />
              </TabsContent>
              <TabsContent value='moderator-management' className='mt-6'>
                <ManageAdminsPanel />
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </AdminLayout>
  );
};

export default AdminPage;
