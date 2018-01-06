exports.config = {
  port: '9515',
  path: '/',
  services: ['chromedriver'],
  specs: [
      './test/**/*.js'
  ],
  maxInstances: 10,
  capabilities: [{
      maxInstances: 1,
      browserName: 'chrome'
  }],
  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  deprecationWarnings: true,
  bail: 0,
  screenshotPath: './errorShots/',
  waitforTimeout: 60000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 60000 }
}
