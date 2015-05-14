import createRestClient from './rest';

class ReleaseClient {
  constructor (config) {
    this.client = createRestClient(config);
  }

  getOne (release) {
    return this.client(`/apps/${release.app}/releases/${release.version}`);
  }

  getList (app) {
    return this.client(`/apps/${app}/releases`);
  }

  create (release) {
    return this.client({
      method: 'POST',
      path: `/apps/${release.app}/releases`,
      entity: { app_release: release },
      headers: { 'Content-Type': 'application/json' }
    });
  }

  update (release) {
    return this.client({
      method: 'PUT',
      path: `/apps/${release.app}/releases/${release.version}`,
      entity: { app_release: release },
      headers: { 'Content-Type': 'application/json' }
    });
  }

  remove (release) {
    return this.client({
      method: 'DELETE',
      path: `/apps/${release.app}/releases/${release.version}`
    });
  }
}

export default ReleaseClient;
