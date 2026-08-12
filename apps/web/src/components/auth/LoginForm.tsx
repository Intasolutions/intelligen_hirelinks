'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@hirelinks/contracts';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../services/auth.service';
import { Button, Input } from '@hirelinks/ui';

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      await AuthService.login(data);
      router.push('/admin/dashboard');
      router.refresh(); // Ensure layout refetches the user
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <Input 
          type="email" 
          {...register('email')} 
          disabled={isSubmitting}
          placeholder="admin@hirelinks.com"
          className="bg-[#0B1319] border-[#21353f] text-white placeholder-gray-500 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
        <Input 
          type="password" 
          {...register('password')} 
          disabled={isSubmitting}
          className="bg-[#0B1319] border-[#21353f] text-white focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-admin-accent hover:bg-admin-accent/90 text-white font-medium py-2 rounded-md transition-colors" disabled={isSubmitting}>
        {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
      </Button>
    </form>
  );
};
