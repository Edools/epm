import { ReleaseClient } from '../../clients';
import Q from 'q';

class Release {
  constructor (config) {
    Object.assign(this, { app: config.app });
    Object.assign(this, config.manifest);
    this.client       = new ReleaseClient(config);
  }

  save () {
    return this.exists()
      .then(() => this.client.update(this.instance))
      .catch(() => this.client.create(this.instance));
  }

  exists () {
    var deferred = Q.defer();

    this.client.getOne(this.instance)
      .then(deferred.resolve)
      .catch(deferred.reject);

    return deferred.promise;
  }
}

export default Release;
