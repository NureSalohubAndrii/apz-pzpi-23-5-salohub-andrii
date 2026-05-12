import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form.component';
import { RegisterForm } from '@/components/auth/register-form.component';

const AuthPage = () => {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            {t(StringKey.LOGIN_TO_YOUR_ACCOUNT)}
          </CardTitle>
          <CardDescription className='text-center text-muted-foreground'>
            {t(StringKey.CREATE_YOUR_ACCOUNT)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='login' className='w-full'>
            <TabsList className='grid w-full grid-cols-2 mb-6'>
              <TabsTrigger value='login'>{t(StringKey.SIGN_IN)}</TabsTrigger>
              <TabsTrigger value='register'>{t(StringKey.SIGN_UP)}</TabsTrigger>
            </TabsList>

            <TabsContent value='login' className='space-y-4'>
              <LoginForm />
            </TabsContent>

            <TabsContent value='register' className='space-y-4'>
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
