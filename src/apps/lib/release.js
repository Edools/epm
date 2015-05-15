import { ReleaseClient } from '../../clients';
import Q from 'q';

class Release {
  constructor (config) {
    this.app          = config.app;
    this.version      = config.manifest.version;
    this.dependencies = config.manifest.dependencies;
    this.routes       = config.manifest.routes;
    this.client       = new ReleaseClient(config);
  }

  save () {
    return this.exists()
      .then(() => this.client.update(this))
      .catch(() => this.client.create(this));
  }

  exists () {
    var deferred = Q.defer();

    this.client.getOne(this)
      .then(deferred.resolve)
      .catch(deferred.reject);

    return deferred.promise;
  }
}

export default Release;
