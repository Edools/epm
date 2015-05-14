import { Source, Release } from './lib';
import R from 'ramda';
import Q from 'q';

class AppHandler {
  static deploy (config, files) {
    let release = new Release(config),
        sources = R.map(file => new Source(file, release, config), files);

    return Q.all(R.map(source => source.upload(), sources))
            .then(() => release.save());
  }
}

export default AppHandler;
