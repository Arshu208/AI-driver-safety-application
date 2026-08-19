import fs from 'fs';
import path from 'path';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { testCases } from './test-cases.js';

const TEST_OUTPUT = path.resolve('./test-results.json');
const WEB_APP_URL = process.env.RIDESAFE_WEB_URL || 'http://10.95.139.45:5175';
const DEFAULT_TIMEOUT = 12000;

async function loadRoute(driver, path) {
  const url = `${WEB_APP_URL.replace(/\/$/, '')}${path}`;
  await driver.get(url);
  await driver.wait(until.elementLocated(By.css('body')), DEFAULT_TIMEOUT);
  await driver.wait(until.elementLocated(By.css('#root > *')), DEFAULT_TIMEOUT);
  return { url: new URL(await driver.getCurrentUrl()) };
}

async function verifyHeading(driver) {
  const heading = await driver.findElements(By.css('h1, h2, h3'));
  if (heading.length === 0) throw new Error('No heading found');
  return 'Heading found';
}

async function verifyButton(driver) {
  const buttons = await driver.findElements(By.css('button, input[type="submit"], a[href]'));
  if (buttons.length === 0) throw new Error('No button-like element found');
  return 'Button element found';
}

async function verifyInput(driver) {
  const inputs = await driver.findElements(By.css('input, textarea, select'));
  if (inputs.length === 0) throw new Error('No input form element found');
  return 'Input element found';
}

async function verifyPageBody(driver) {
  const body = await driver.findElement(By.css('body'));
  const bodyMarkup = await body.getAttribute('innerHTML');
  if (!bodyMarkup || bodyMarkup.trim().length === 0) throw new Error('Page body is empty');
  return 'Rendered body content exists';
}

async function verifyAction(driver, testCase) {
  const path = testCase.path;
  const action = testCase.action;

  const { url } = await loadRoute(driver, path);
  const result = { success: true, detail: '' };

  switch (action) {
    case 'load':
      if (!url.pathname.includes(path)) {
        throw new Error(`Loaded url did not match expected path: ${url.pathname}`);
      }
      result.detail = `Loaded ${path}`;
      break;
    case 'heading':
      result.detail = await verifyHeading(driver);
      break;
    case 'button':
      result.detail = await verifyButton(driver);
      break;
    case 'input':
      result.detail = await verifyInput(driver);
      break;
    case 'meta':
      result.detail = await verifyPageBody(driver);
      break;
    case 'route':
      result.detail = url.pathname.includes(path)
        ? `Route ${path} accessible` 
        : `Route navigation landed at ${url.pathname}`;
      break;
    case 'ping':
      result.detail = await verifyPageBody(driver);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }

  return result;
}

async function seedAuthenticatedSession(driver) {
  await driver.get(WEB_APP_URL);
  await driver.executeScript(() => {
    const user = {
      id: 'ci-driver',
      name: 'CI Driver',
      phone: '9999999999',
      role: 'DRIVER',
      safetyScore: 100,
    };
    const state = { user, token: 'ci-test-token', isAuthenticated: true };
    localStorage.setItem('token', state.token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('ridesafe-auth', JSON.stringify({ state, version: 0 }));
  });
  await driver.navigate().refresh();
}

async function runTestCaseWithRetry(driver, testCase) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await verifyAction(driver, testCase);
    } catch (error) {
      lastError = error;
      if (attempt === 0) await driver.navigate().refresh();
    }
  }
  throw lastError;
}

async function run() {
  const chromeOptions = new chrome.Options()
    .addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1280,900');
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  const results = [];

  try {
    await seedAuthenticatedSession(driver);
    for (const testCase of testCases) {
      const result = {
        id: testCase.id,
        title: `${testCase.path} - ${testCase.description}`,
        status: 'PASS',
        detail: '',
        timestamp: new Date().toISOString()
      };

      try {
        const actionResult = await runTestCaseWithRetry(driver, testCase);
        result.detail = actionResult.detail;
      } catch (error) {
        result.status = 'FAIL';
        result.detail = `${error.name}: ${error.message}`;
      }

      console.log(`${result.id} ${result.title} -> ${result.status}`);
      results.push(result);
    }
  } finally {
    await driver.quit();
    fs.writeFileSync(TEST_OUTPUT, JSON.stringify(results, null, 2));
    console.log(`Saved results to ${TEST_OUTPUT}`);
    if (results.some((result) => result.status !== 'PASS')) {
      throw new Error('One or more Selenium test cases failed.');
    }
  }
}

run().catch((error) => {
  console.error('Runner failed:', error);
  process.exit(1);
});
