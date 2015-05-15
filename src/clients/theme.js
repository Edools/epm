import createRestClient from './rest';

class ThemeClient {
  constructor (config) {
    this.client = createRestClient(config);
  }

  update (theme) {
    return this.client({
      method: 'PUT',
      path: `/themes/${theme.id}`,
      entity: { theme: theme },
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default ThemeClient;
