
export default {
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
