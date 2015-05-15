import { Theme, DepsResolver } from './lib';

class ThemeHandler {
  static deploy (config) {
    let theme = new Theme(config),
      depsResolver = new DepsResolver(config);

    return depsResolver.resolve(config.dependencies)
      .then(dependencies => theme.deploy(dependencies))
      .catch((err) => {
        throw err;
      });
  }
}

export default ThemeHandler;
