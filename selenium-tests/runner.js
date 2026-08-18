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
  const bodyText = await driver.findElement(By.css('body')).getText();
  if (!bodyText || bodyText.length < 10) throw new Error('Page body is empty');
  return 'Body content exists';
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

async function run() {
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
  const results = [];

  try {
    for (const testCase of testCases) {
      const result = {
        id: testCase.id,
        title: `${testCase.path} - ${testCase.description}`,
        status: 'PASS',
        detail: '',
        timestamp: new Date().toISOString()
      };

      try {
        const actionResult = await verifyAction(driver, testCase);
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
