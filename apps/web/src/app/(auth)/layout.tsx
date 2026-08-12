import { SettingsService } from '../../services/settings.service';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  let companyName = 'Intelligen Hirelinks';
  
  try {
    const res = await SettingsService.getSettings();
    if (res.success && res.data) {
      companyName = res.data.companyName;
    }
  } catch (err) {}

  return (
    <div className="min-h-screen bg-[#0B1319] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white tracking-tight">
          {companyName}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Admin Control Center
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#18232c] py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-[#21353f] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
