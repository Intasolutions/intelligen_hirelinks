import { AuthService } from '../../services/auth.service';
import AdminLayoutShell from './AdminLayoutShell';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  
  try {
    const res = await AuthService.me();
    if (res.success && res.data) {
      user = res.data;
    } else {
      throw new Error('Unauthorized');
    }
  } catch (error) {
    // If the token is invalid or expired, the backend returns 401
    redirect('/login');
  }

  return (
    <AdminLayoutShell user={user}>
      {children}
    </AdminLayoutShell>
  );
}
