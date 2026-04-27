// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests',
  //By default it is 30 seconds to override to do as below 
  //timeout wait is for overall project all the steps and components for a testcases that is TC will wait max of 40 sec if any error occurs
  timeout: 40 * 1000,
  expect: {
    // expect (assertion) level timeout is 5 sec
    timeout: 5000,
  },
  reporter: [['html', { open: 'always' }]],
  projects: [
    {
        name: 'firefox',
        use: {
        browserName: 'firefox',
        headless: true,
        //takes screenshot on every step
        screenshot: 'off',
        //logs can be generated 
        //trace:'on' //always on
        trace: 'retain-on-failure' //only on failure 
      }
    },
    {
        name: 'chrome',
        use: {
        browserName: 'chromium',
        headless: false,
        //takes screenshot on every step
        screenshot: 'on',
        //logs can be generated 
        //trace:'on' //always on
        trace: 'retain-on-failure' //only on failure 
      }
    }
  ]
});
module.exports = config
