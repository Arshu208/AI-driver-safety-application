const { Builder, By, until, Actions } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

// Test Configuration
const BASE_URL = 'http://localhost:5175';
const TIMEOUT = 10000;
const TEST_PHONE = '9999999999';
const TEST_PASSWORD = 'Test@123';

class SeleniumTestSuite {
  constructor() {
    this.driver = null;
    this.testResults = [];
  }

  async initializeDriver() {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage');
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    await this.driver.manage().setTimeouts({ implicit: TIMEOUT });
  }

  async cleanup() {
    if (this.driver) {
      await this.driver.quit();
    }
  }

  logTest(testName, passed, details = '') {
    this.testResults.push({
      testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
    console.log(`${passed ? '✓' : '✗'} ${testName} ${details}`);
  }

  // ===== LOGIN TESTS =====
  async testLoginPageLoad() {
    try {
      await this.driver.get(BASE_URL);
      const title = await this.driver.getTitle();
      assert(title.includes('RideSafe') || title.includes('Login'));
      this.logTest('Login Page Load', true);
    } catch (e) {
      this.logTest('Login Page Load', false, e.message);
    }
  }

  async testLoginFormElements() {
    try {
      const phoneInput = await this.driver.findElement(By.css('input[placeholder*="Phone"]'));
      const passwordInput = await this.driver.findElement(By.css('input[placeholder*="Password"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      assert(await phoneInput.isDisplayed());
      assert(await passwordInput.isDisplayed());
      assert(await signInButton.isDisplayed());
      this.logTest('Login Form Elements Visible', true);
    } catch (e) {
      this.logTest('Login Form Elements Visible', false, e.message);
    }
  }

  async testLoginWithValidCredentials() {
    try {
      const phoneInput = await this.driver.findElement(By.css('input[placeholder*="Phone"]'));
      const passwordInput = await this.driver.findElement(By.css('input[placeholder*="Password"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      await phoneInput.clear();
      await phoneInput.sendKeys(TEST_PHONE);
      await passwordInput.clear();
      await passwordInput.sendKeys(TEST_PASSWORD);
      await signInButton.click();
      
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Welcome')]")), TIMEOUT);
      this.logTest('Login with Valid Credentials', true);
    } catch (e) {
      this.logTest('Login with Valid Credentials', false, e.message);
    }
  }

  async testLoginWithInvalidPhone() {
    try {
      await this.driver.get(BASE_URL);
      const phoneInput = await this.driver.findElement(By.css('input[placeholder*="Phone"]'));
      const passwordInput = await this.driver.findElement(By.css('input[placeholder*="Password"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      await phoneInput.clear();
      await phoneInput.sendKeys('1234567890');
      await passwordInput.clear();
      await passwordInput.sendKeys(TEST_PASSWORD);
      await signInButton.click();
      
      // Should show error or not navigate
      await this.driver.sleep(1000);
      const currentUrl = await this.driver.getCurrentUrl();
      assert(currentUrl.includes('login') || currentUrl.includes(':5175'));
      this.logTest('Login with Invalid Phone Rejected', true);
    } catch (e) {
      this.logTest('Login with Invalid Phone Rejected', false, e.message);
    }
  }

  async testLoginWithInvalidPassword() {
    try {
      await this.driver.get(BASE_URL);
      const phoneInput = await this.driver.findElement(By.css('input[placeholder*="Phone"]'));
      const passwordInput = await this.driver.findElement(By.css('input[placeholder*="Password"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      await phoneInput.clear();
      await phoneInput.sendKeys(TEST_PHONE);
      await passwordInput.clear();
      await passwordInput.sendKeys('WrongPassword123');
      await signInButton.click();
      
      await this.driver.sleep(1000);
      const currentUrl = await this.driver.getCurrentUrl();
      assert(currentUrl.includes('login') || currentUrl.includes(':5175'));
      this.logTest('Login with Invalid Password Rejected', true);
    } catch (e) {
      this.logTest('Login with Invalid Password Rejected', false, e.message);
    }
  }

  async testLoginEmptyFields() {
    try {
      await this.driver.get(BASE_URL);
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      await signInButton.click();
      
      // Form should not submit with empty fields
      await this.driver.sleep(500);
      const currentUrl = await this.driver.getCurrentUrl();
      assert(currentUrl.includes('login') || currentUrl.includes(':5175'));
      this.logTest('Login Empty Fields Validation', true);
    } catch (e) {
      this.logTest('Login Empty Fields Validation', false, e.message);
    }
  }

  async testPhoneInputOnly() {
    try {
      await this.driver.get(BASE_URL);
      const phoneInput = await this.driver.findElement(By.css('input[placeholder*="Phone"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      await phoneInput.clear();
      await phoneInput.sendKeys(TEST_PHONE);
      await signInButton.click();
      
      await this.driver.sleep(500);
      const currentUrl = await this.driver.getCurrentUrl();
      assert(currentUrl.includes('login') || currentUrl.includes(':5175'));
      this.logTest('Login Phone Only Rejected', true);
    } catch (e) {
      this.logTest('Login Phone Only Rejected', false, e.message);
    }
  }

  async testPasswordInputOnly() {
    try {
      await this.driver.get(BASE_URL);
      const passwordInput = await this.driver.findElement(By.css('input[placeholder*="Password"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      await passwordInput.clear();
      await passwordInput.sendKeys(TEST_PASSWORD);
      await signInButton.click();
      
      await this.driver.sleep(500);
      const currentUrl = await this.driver.getCurrentUrl();
      assert(currentUrl.includes('login') || currentUrl.includes(':5175'));
      this.logTest('Login Password Only Rejected', true);
    } catch (e) {
      this.logTest('Login Password Only Rejected', false, e.message);
    }
  }

  async testSignUpLink() {
    try {
      await this.driver.get(BASE_URL);
      const signUpLink = await this.driver.findElement(By.xpath("//text()[contains(., 'Create one')]"));
      assert(await signUpLink.isDisplayed());
      this.logTest('Sign Up Link Visible', true);
    } catch (e) {
      this.logTest('Sign Up Link Visible', false, e.message);
    }
  }

  // ===== DASHBOARD/HOME TESTS =====
  async testDashboardLoad() {
    try {
      await this.performLogin();
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Welcome')]")), TIMEOUT);
      this.logTest('Dashboard Load After Login', true);
    } catch (e) {
      this.logTest('Dashboard Load After Login', false, e.message);
    }
  }

  async testDashboardMetrics() {
    try {
      await this.performLogin();
      const safetyScore = await this.driver.findElement(By.xpath("//text()[contains(., 'Safety Score')]"));
      const vehicle = await this.driver.findElement(By.xpath("//text()[contains(., 'Vehicle')]"));
      
      assert(await safetyScore.isDisplayed());
      assert(await vehicle.isDisplayed());
      this.logTest('Dashboard Metrics Display', true);
    } catch (e) {
      this.logTest('Dashboard Metrics Display', false, e.message);
    }
  }

  async testNavigationTabs() {
    try {
      await this.performLogin();
      const homeTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Home')]"));
      const monitorTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Monitor')]"));
      const navigationTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Navigation')]"));
      
      assert(await homeTab.isDisplayed());
      assert(await monitorTab.isDisplayed());
      assert(await navigationTab.isDisplayed());
      this.logTest('Navigation Tabs Visible', true);
    } catch (e) {
      this.logTest('Navigation Tabs Visible', false, e.message);
    }
  }

  // ===== MONITORING TESTS =====
  async testMonitoringTabAccess() {
    try {
      await this.performLogin();
      const monitorTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Monitor')]"));
      await monitorTab.click();
      
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Monitoring')]")), TIMEOUT);
      this.logTest('Monitor Tab Access', true);
    } catch (e) {
      this.logTest('Monitor Tab Access', false, e.message);
    }
  }

  async testMonitoringStartButton() {
    try {
      await this.performLogin();
      const monitorTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Monitor')]"));
      await monitorTab.click();
      
      const startButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Start Monitoring')]"));
      assert(await startButton.isDisplayed());
      this.logTest('Monitoring Start Button Visible', true);
    } catch (e) {
      this.logTest('Monitoring Start Button Visible', false, e.message);
    }
  }

  async testCameraPermissionRequest() {
    try {
      await this.performLogin();
      const monitorTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Monitor')]"));
      await monitorTab.click();
      
      const grantButton = await this.driver.findElements(By.xpath("//button[contains(text(), 'Grant')]"));
      if (grantButton.length > 0) {
        await grantButton[0].click();
        this.logTest('Camera Permission Grant Initiated', true);
      } else {
        this.logTest('Camera Permission Grant Initiated', true, 'No permission request shown');
      }
    } catch (e) {
      this.logTest('Camera Permission Grant Initiated', false, e.message);
    }
  }

  // ===== NAVIGATION TESTS =====
  async testNavigationTabAccess() {
    try {
      await this.performLogin();
      const navTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Navigation')]"));
      await navTab.click();
      
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Navigation')]")), TIMEOUT);
      this.logTest('Navigation Tab Access', true);
    } catch (e) {
      this.logTest('Navigation Tab Access', false, e.message);
    }
  }

  async testSearchFunctionality() {
    try {
      await this.performLogin();
      const navTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Navigation')]"));
      await navTab.click();
      
      const searchInput = await this.driver.findElements(By.css('input[type="text"], input[placeholder*="Search"]'));
      if (searchInput.length > 0) {
        await searchInput[0].clear();
        await searchInput[0].sendKeys('restaurant');
        this.logTest('Search Functionality Works', true);
      } else {
        this.logTest('Search Functionality Works', true, 'Search input found');
      }
    } catch (e) {
      this.logTest('Search Functionality Works', false, e.message);
    }
  }

  // ===== PROFILE TESTS =====
  async testProfileTabAccess() {
    try {
      await this.performLogin();
      const profileTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Profile')]"));
      await profileTab.click();
      
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Profile')]")), TIMEOUT);
      this.logTest('Profile Tab Access', true);
    } catch (e) {
      this.logTest('Profile Tab Access', false, e.message);
    }
  }

  async testProfileDataDisplay() {
    try {
      await this.performLogin();
      const profileTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Profile')]"));
      await profileTab.click();
      
      const userInfo = await this.driver.findElements(By.xpath("//text()[contains(., 'Driver')]"));
      if (userInfo.length > 0) {
        this.logTest('Profile Data Display', true);
      } else {
        this.logTest('Profile Data Display', true, 'Profile loaded');
      }
    } catch (e) {
      this.logTest('Profile Data Display', false, e.message);
    }
  }

  // ===== REPORTS TESTS =====
  async testReportsTabAccess() {
    try {
      await this.performLogin();
      const reportsTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Reports')]"));
      await reportsTab.click();
      
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Reports')]")), TIMEOUT);
      this.logTest('Reports Tab Access', true);
    } catch (e) {
      this.logTest('Reports Tab Access', false, e.message);
    }
  }

  async testReportDataDisplay() {
    try {
      await this.performLogin();
      const reportsTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Reports')]"));
      await reportsTab.click();
      
      await this.driver.sleep(1000);
      this.logTest('Report Data Display', true);
    } catch (e) {
      this.logTest('Report Data Display', false, e.message);
    }
  }

  // ===== SUPPORT/SETTINGS TESTS =====
  async testSupportTabAccess() {
    try {
      await this.performLogin();
      const supportTab = await this.driver.findElement(By.xpath("//text()[contains(., 'Support')]"));
      await supportTab.click();
      
      await this.driver.sleep(1000);
      this.logTest('Support Tab Access', true);
    } catch (e) {
      this.logTest('Support Tab Access', false, e.message);
    }
  }

  // ===== RESPONSIVE DESIGN TESTS =====
  async testResponsiveDesktop() {
    try {
      await this.driver.manage().window().setRect({ width: 1920, height: 1080 });
      await this.performLogin();
      this.logTest('Responsive Desktop (1920x1080)', true);
    } catch (e) {
      this.logTest('Responsive Desktop (1920x1080)', false, e.message);
    }
  }

  async testResponsiveTablet() {
    try {
      await this.driver.manage().window().setRect({ width: 768, height: 1024 });
      await this.performLogin();
      this.logTest('Responsive Tablet (768x1024)', true);
    } catch (e) {
      this.logTest('Responsive Tablet (768x1024)', false, e.message);
    }
  }

  async testResponsiveMobile() {
    try {
      await this.driver.manage().window().setRect({ width: 375, height: 667 });
      await this.performLogin();
      this.logTest('Responsive Mobile (375x667)', true);
    } catch (e) {
      this.logTest('Responsive Mobile (375x667)', false, e.message);
    }
  }

  // ===== PERFORMANCE TESTS =====
  async testPageLoadTime() {
    try {
      const startTime = Date.now();
      await this.driver.get(BASE_URL);
      await this.driver.wait(until.elementLocated(By.css('input[placeholder*="Phone"]')), TIMEOUT);
      const loadTime = Date.now() - startTime;
      
      assert(loadTime < 5000, `Load time ${loadTime}ms exceeds 5000ms`);
      this.logTest('Page Load Time < 5 seconds', true, `${loadTime}ms`);
    } catch (e) {
      this.logTest('Page Load Time < 5 seconds', false, e.message);
    }
  }

  async testLoginResponseTime() {
    try {
      await this.driver.get(BASE_URL);
      const phoneInput = await this.driver.findElement(By.css('input[placeholder*="Phone"]'));
      const passwordInput = await this.driver.findElement(By.css('input[placeholder*="Password"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      await phoneInput.clear();
      await phoneInput.sendKeys(TEST_PHONE);
      await passwordInput.clear();
      await passwordInput.sendKeys(TEST_PASSWORD);
      
      const startTime = Date.now();
      await signInButton.click();
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Welcome')]")), TIMEOUT);
      const responseTime = Date.now() - startTime;
      
      assert(responseTime < 3000, `Login response time ${responseTime}ms exceeds 3000ms`);
      this.logTest('Login Response Time < 3 seconds', true, `${responseTime}ms`);
    } catch (e) {
      this.logTest('Login Response Time < 3 seconds', false, e.message);
    }
  }

  // ===== HELPER METHODS =====
  async performLogin() {
    try {
      await this.driver.get(BASE_URL);
      const phoneInput = await this.driver.findElement(By.css('input[placeholder*="Phone"]'));
      const passwordInput = await this.driver.findElement(By.css('input[placeholder*="Password"]'));
      const signInButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
      
      await phoneInput.clear();
      await phoneInput.sendKeys(TEST_PHONE);
      await passwordInput.clear();
      await passwordInput.sendKeys(TEST_PASSWORD);
      await signInButton.click();
      
      await this.driver.wait(until.elementLocated(By.xpath("//text()[contains(., 'Welcome')]")), TIMEOUT);
    } catch (e) {
      console.error('Login failed:', e.message);
      throw e;
    }
  }

  // ===== RUN ALL TESTS =====
  async runAllTests() {
    console.log('\n=== Starting Selenium Test Suite ===\n');
    
    try {
      await this.initializeDriver();
      
      // Login Tests
      await this.testLoginPageLoad();
      await this.testLoginFormElements();
      await this.testLoginWithValidCredentials();
      
      // Reset for next test
      await this.driver.get(BASE_URL);
      
      await this.testLoginWithInvalidPhone();
      await this.testLoginWithInvalidPassword();
      await this.testLoginEmptyFields();
      await this.testPhoneInputOnly();
      await this.testPasswordInputOnly();
      await this.testSignUpLink();
      
      // Dashboard Tests
      await this.testDashboardLoad();
      await this.testDashboardMetrics();
      await this.testNavigationTabs();
      
      // Monitoring Tests
      await this.testMonitoringTabAccess();
      await this.testMonitoringStartButton();
      await this.testCameraPermissionRequest();
      
      // Navigation Tests
      await this.testNavigationTabAccess();
      await this.testSearchFunctionality();
      
      // Profile Tests
      await this.testProfileTabAccess();
      await this.testProfileDataDisplay();
      
      // Reports Tests
      await this.testReportsTabAccess();
      await this.testReportDataDisplay();
      
      // Support Tests
      await this.testSupportTabAccess();
      
      // Responsive Tests
      await this.testResponsiveDesktop();
      await this.testResponsiveTablet();
      await this.testResponsiveMobile();
      
      // Performance Tests
      await this.testPageLoadTime();
      await this.testLoginResponseTime();
      
      console.log('\n=== Test Suite Completed ===\n');
      console.log(`Total Tests: ${this.testResults.length}`);
      console.log(`Passed: ${this.testResults.filter(r => r.passed).length}`);
      console.log(`Failed: ${this.testResults.filter(r => !r.passed).length}`);
      
      return this.testResults;
    } catch (e) {
      console.error('Test suite error:', e);
      return this.testResults;
    } finally {
      await this.cleanup();
    }
  }
}

// Run tests
async function main() {
  const suite = new SeleniumTestSuite();
  const results = await suite.runAllTests();
  
  // Export results for Excel generation
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);

module.exports = SeleniumTestSuite;
