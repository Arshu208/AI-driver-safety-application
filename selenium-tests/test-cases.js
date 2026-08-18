const routeDefinitions = [
  { path: '/', auth: false, description: 'Landing page' },
  { path: '/splash', auth: false, description: 'Splash page' },
  { path: '/onboarding-1', auth: false, description: 'Onboarding step 1' },
  { path: '/onboarding-2', auth: false, description: 'Onboarding step 2' },
  { path: '/onboarding-3', auth: false, description: 'Onboarding step 3' },
  { path: '/onboarding-4', auth: false, description: 'Onboarding step 4' },
  { path: '/login', auth: false, description: 'Login screen' },
  { path: '/signup', auth: false, description: 'Signup screen' },
  { path: '/forgot-password', auth: false, description: 'Forgot password screen' },
  { path: '/otp-verification', auth: false, description: 'OTP verification screen' },
  { path: '/create-profile', auth: false, description: 'Create profile screen' },
  { path: '/enable-camera', auth: false, description: 'Enable camera permission screen' },
  { path: '/enable-location', auth: false, description: 'Enable location permission screen' },
  { path: '/enable-notifications', auth: false, description: 'Enable notifications screen' },
  { path: '/vehicle-setup', auth: false, description: 'Vehicle setup screen' },
  { path: '/add-driver-details', auth: false, description: 'Add driver details screen' },
  { path: '/home', auth: true, description: 'Home dashboard' },
  { path: '/ai-monitoring-live', auth: true, description: 'Live AI monitoring page' },
  { path: '/camera-calibration', auth: true, description: 'Camera calibration page' },
  { path: '/eye-tracking', auth: true, description: 'Eye tracking page' },
  { path: '/emotion-detection', auth: true, description: 'Driver emotion detection page' },
  { path: '/night-vision', auth: true, description: 'Night vision page' },
  { path: '/smart-navigation', auth: true, description: 'Smart navigation page' },
  { path: '/trip-start', auth: true, description: 'Trip start confirmation' },
  { path: '/active-session', auth: true, description: 'Active driving session screen' },
  { path: '/live-analytics', auth: true, description: 'Live AI analytics dashboard' },
  { path: '/fatigue-score', auth: true, description: 'Fatigue score detail page' },
  { path: '/behavior-analysis', auth: true, description: 'Driving behavior analysis page' },
  { path: '/trip-summary', auth: true, description: 'Trip summary page' },
  { path: '/emergency-sos', auth: true, description: 'Emergency SOS trigger page' },
  { path: '/emergency-contacts', auth: true, description: 'Emergency contact screen' },
  { path: '/accident-alert', auth: true, description: 'Accident detection alert page' },
  { path: '/nearby-hospitals', auth: true, description: 'Nearby hospitals help page' },
  { path: '/daily-report', auth: true, description: 'Daily driving report' },
  { path: '/weekly-analytics', auth: true, description: 'Weekly safety analytics' },
  { path: '/monthly-dashboard', auth: true, description: 'Monthly performance dashboard' },
  { path: '/leaderboard', auth: true, description: 'Driver leaderboard' },
  { path: '/rewards', auth: true, description: 'Rewards achievement screen' },
  { path: '/fleet-dashboard', auth: true, description: 'Fleet management dashboard' },
  { path: '/fleet-monitoring', auth: true, description: 'Fleet driver monitoring' },
  { path: '/vehicle-health', auth: true, description: 'Vehicle health monitoring' },
  { path: '/ai-coach', auth: true, description: 'AI safety coach chatbot' },
  { path: '/settings', auth: true, description: 'Settings screen' },
  { path: '/notification-settings', auth: true, description: 'Notification preferences' },
  { path: '/privacy-security', auth: true, description: 'Privacy & security settings' },
  { path: '/subscription', auth: true, description: 'Subscription plans page' },
  { path: '/theme-customization', auth: true, description: 'Theme customization page' },
  { path: '/logout', auth: true, description: 'Logout confirmation page' }
];

const actions = [
  { name: 'load', description: 'Load route and verify URL' },
  { name: 'heading', description: 'Validate heading exists' },
  { name: 'button', description: 'Validate at least one button exists' },
  { name: 'input', description: 'Validate at least one input exists' },
  { name: 'meta', description: 'Validate main page content exists' },
  { name: 'route', description: 'Verify route navigation is reachable' },
  { name: 'ping', description: 'Verify the page body contains text' }
];

function makeTestCases() {
  const tests = [];
  let id = 1;

  for (const route of routeDefinitions) {
    for (const action of actions) {
      if (tests.length >= 310) break;
      tests.push({
        id: `TC${id.toString().padStart(3, '0')}`,
        path: route.path,
        auth: route.auth,
        description: `${route.description} - ${action.description}`,
        action: action.name
      });
      id += 1;
    }
    if (tests.length >= 310) break;
  }

  return tests;
}

export const testCases = makeTestCases();
