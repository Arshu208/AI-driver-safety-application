import axios from 'axios';
import { performance } from 'node:perf_hooks';

class LoadTestSuite {
  constructor(baseURL = 'http://localhost:5000/api', numUsers = 100, duration = 60000) {
    this.baseURL = baseURL;
    this.numUsers = numUsers;
    this.duration = duration; // milliseconds
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      startTime: null,
      endTime: null,
      errors: []
    };
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000
    });
  }

  async loginUser(userId) {
    try {
      const startTime = performance.now();
      const response = await this.client.post('/auth/login', {
        phone: '9999999999',
        password: 'Test@123'
      });
      const responseTime = performance.now() - startTime;
      
      this.recordResponse(responseTime, true);
      return response.data.token;
    } catch (error) {
      this.recordResponse(0, false, 'Login', error.message);
      return null;
    }
  }

  async testHealthEndpoint() {
    try {
      const startTime = performance.now();
      await this.client.get('/health');
      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, true);
    } catch (error) {
      this.recordResponse(0, false, 'Health', error.message);
    }
  }

  async testLoginEndpoint() {
    try {
      const startTime = performance.now();
      await this.client.post('/auth/login', {
        phone: '9999999999',
        password: 'Test@123'
      });
      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, true);
    } catch (error) {
      this.recordResponse(0, false, 'Login', error.message);
    }
  }

  async testTripStartEndpoint(token) {
    try {
      const startTime = performance.now();
      await this.client.post('/trips/start', 
        { startLocation: 'Test Location' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, true);
    } catch (error) {
      this.recordResponse(0, false, 'Trip Start', error.message);
    }
  }

  async testTripEndEndpoint(token) {
    try {
      const startTime = performance.now();
      await this.client.post('/trips/end',
        { endLocation: 'Test Location', distance: 10, duration: 1200 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, true);
    } catch (error) {
      this.recordResponse(0, false, 'Trip End', error.message);
    }
  }

  async testNavigationSearchEndpoint() {
    try {
      const startTime = performance.now();
      await this.client.get('/navigation/search?q=restaurant');
      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, true);
    } catch (error) {
      this.recordResponse(0, false, 'Navigation Search', error.message);
    }
  }

  async testAnalyticsEndpoint(token) {
    try {
      const startTime = performance.now();
      await this.client.get('/analytics/dashboard', 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, true);
    } catch (error) {
      this.recordResponse(0, false, 'Analytics', error.message);
    }
  }

  recordResponse(responseTime, success, endpoint = 'API', error = null) {
    this.results.totalRequests++;
    
    if (success) {
      this.results.successfulRequests++;
      this.results.responseTimes.push(responseTime);
    } else {
      this.results.failedRequests++;
      this.results.errors.push({ endpoint, error, timestamp: new Date().toISOString() });
    }
  }

  getStats() {
    const responseTimes = this.results.responseTimes;
    
    if (responseTimes.length === 0) {
      return {
        minResponseTime: 0,
        maxResponseTime: 0,
        avgResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0
      };
    }

    const sorted = [...responseTimes].sort((a, b) => a - b);
    
    return {
      minResponseTime: sorted[0],
      maxResponseTime: sorted[sorted.length - 1],
      avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      medianResponseTime: sorted[Math.floor(sorted.length / 2)],
      p95ResponseTime: sorted[Math.floor(sorted.length * 0.95)],
      p99ResponseTime: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  async runLoadTest() {
    console.log('\n=== Starting Load Test ===');
    console.log(`Users: ${this.numUsers}`);
    console.log(`Duration: ${this.duration / 1000} seconds\n`);

    this.results.startTime = new Date();

    const userPromises = [];

    // Create virtual users
    for (let i = 0; i < this.numUsers; i++) {
      const userPromise = (async () => {
        const endTime = Date.now() + this.duration;
        let token = null;

        try {
          // Initial login
          token = await this.loginUser(i);
        } catch (e) {
          console.error(`User ${i} login failed:`, e.message);
        }

        // Simulate user actions within duration
        while (Date.now() < endTime) {
          try {
            // Health check
            await this.testHealthEndpoint();
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

            // Login test
            await this.testLoginEndpoint();
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

            // Navigation search
            await this.testNavigationSearchEndpoint();
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

            // If logged in, test authenticated endpoints
            if (token) {
              await this.testTripStartEndpoint(token);
              await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

              await this.testAnalyticsEndpoint(token);
              await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
            }
          } catch (error) {
            // Continue with next iteration
          }
        }
      })();

      userPromises.push(userPromise);
    }

    // Wait for all virtual users to complete
    await Promise.all(userPromises);

    this.results.endTime = new Date();

    return this.generateReport();
  }

  generateReport() {
    const stats = this.getStats();
    const elapsedTime = (this.results.endTime - this.results.startTime) / 1000;
    const throughput = (this.results.totalRequests / elapsedTime).toFixed(2);
    const successRate = ((this.results.successfulRequests / this.results.totalRequests) * 100).toFixed(2);

    const report = {
      summary: {
        totalRequests: this.results.totalRequests,
        successfulRequests: this.results.successfulRequests,
        failedRequests: this.results.failedRequests,
        successRate: `${successRate}%`,
        throughput: `${throughput} req/sec`,
        elapsedTime: `${elapsedTime.toFixed(2)} sec`,
        startTime: this.results.startTime.toISOString(),
        endTime: this.results.endTime.toISOString(),
        virtualUsers: this.numUsers
      },
      performance: {
        minResponseTime: `${stats.minResponseTime.toFixed(2)} ms`,
        maxResponseTime: `${stats.maxResponseTime.toFixed(2)} ms`,
        avgResponseTime: `${stats.avgResponseTime.toFixed(2)} ms`,
        medianResponseTime: `${stats.medianResponseTime.toFixed(2)} ms`,
        p95ResponseTime: `${stats.p95ResponseTime.toFixed(2)} ms`,
        p99ResponseTime: `${stats.p99ResponseTime.toFixed(2)} ms`
      },
      errors: this.results.errors.slice(0, 10) // First 10 errors
    };

    return report;
  }

  printReport(report) {
    console.log('\n=== Load Test Report ===\n');
    
    console.log('SUMMARY:');
    console.log('--------');
    Object.entries(report.summary).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    console.log('\nPERFORMANCE:');
    console.log('-------------');
    Object.entries(report.performance).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    if (report.errors.length > 0) {
      console.log('\nERRORS:');
      console.log('-------');
      report.errors.forEach((error, idx) => {
        console.log(`${idx + 1}. ${error.endpoint}: ${error.error}`);
      });
    }

    console.log('\n=== Test Complete ===\n');
    return report;
  }
}

// Run load test
async function main() {
  const apiUrl = process.env['RIDESAFE_API_URL'] || 'http://localhost:5000/api';
  const loadTest = new LoadTestSuite(
    apiUrl,
    Number(process.env.LOAD_TEST_USERS || 10),
    Number(process.env.LOAD_TEST_DURATION_MS || 10000)
  );

  const report = await loadTest.runLoadTest();
  loadTest.printReport(report);

  // Export results
  console.log(JSON.stringify(report, null, 2));
  if (report.summary.failedRequests > 0) {
    process.exitCode = 1;
  }
}

main().catch(console.error);

export default LoadTestSuite;
