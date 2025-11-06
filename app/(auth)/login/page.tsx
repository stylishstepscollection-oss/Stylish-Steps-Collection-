import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';
import Logo from '@/public/SSC.png';

export const metadata: Metadata = {
  title: 'Login | Stylish Steps Collection',
  description: 'Sign in to your account',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary to-primary-light">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 animate-pulse">
<Image
                src={Logo}
                alt="Stylish Steps Collection"
                width={80} height={80}
                className="object-contain p-4"
                priority
              />            </div>
          <h1 className="text-3xl font-bold text-white mb-2">Stylish Steps Collection</h1>
          <p className="text-white/80">Step into Style ✨</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}