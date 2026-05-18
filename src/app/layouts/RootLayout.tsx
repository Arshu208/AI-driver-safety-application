import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const screensWithoutBottomNav = [
  '/',
  '/onboarding-1',
  '/onboarding-2',
  '/onboarding-3',
  '/onboarding-4',
  '/login',
  '/signup',
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
    <div className="min-h-screen bg-background dark">
      <div className="max-w-md mx-auto min-h-screen bg-background relative">
        <div className={`${showBottomNav ? 'pb-20' : ''}`}>
          <Outlet />
        </div>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
