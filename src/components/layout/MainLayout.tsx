import { Outlet } from 'react-router-dom';
import { Sidebar } from '../ui/Sidebar';
import { ToastProvider } from '../ui/ToastProvider';

export function MainLayout() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F5F6FA]">
        <Sidebar />
        <main className="sm:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 sm:pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
