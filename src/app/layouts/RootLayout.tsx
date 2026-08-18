import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import DesktopSidebar from '../components/DesktopSidebar';

const screensWithoutBottomNav = [
  '/',
  '/onboarding-1',
  '/onboarding-2',
  '/onboarding-3',
  '/onboarding-4',
  '/login',
  '/signup',
  '/face-lock-setup',
  '/forgot-password',
  '/otp-verification',
  '/create-profile',
  '/enable-camera',
  '/enable-location',
  '/enable-notifications',
  '/vehicle-setup',
  '/add-driver-details',
  '/logout',
];

export default function RootLayout() {
  const location = useLocation();
  const showBottomNav = !screensWithoutBottomNav.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] bg-background/80 shadow-[0_0_80px_rgba(15,23,42,0.08)]">
        {showBottomNav && <DesktopSidebar />}
        <main className={`min-w-0 flex-1 ${showBottomNav ? 'pb-20 lg:pb-0' : ''}`}>
          <Outlet />
        </main>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
