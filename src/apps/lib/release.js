import { ReleaseClient } from '../../clients';
import Q from 'q';
import R from 'ramda';

class Release {
  constructor (config) {
    this.release      = R.merge({ app: config.app }, config.manifest);
    this.client       = new ReleaseClient(config);
  }

  save () {
    return this.exists()
      .then(() => this.client.update(this.release))
      .catch(() => this.client.create(this.release));
  }

  exists () {
    var deferred = Q.defer();

    this.client.getOne(this.release)
      .then(deferred.resolve)
      .catch(deferred.reject);

    return deferred.promise;
  }
}

export default Release;
