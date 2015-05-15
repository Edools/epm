let appConfig = {
  app: 'home',
  token: process.env.RELEASE_TOKEN,
  s3Options: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey'
  },
  manifest: {
    version: '10.10.0',
    dependencies: {
      'auth': 'latest'
    },
    routes: [{
      url: '/myroute'
    }]
  }
};

let themeConfig = {
  dependencies: {
    home: '0.8.0-beta.49',
    ecommerce: '0.8.0-beta.49'
  },
  token: process.env.RELEASE_TOKEN
};

export { appConfig, themeConfig };
