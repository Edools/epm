import { ThemeClient } from '../../clients';

class Theme {
  constructor (config) {
    this.id = config.id;
    this.package_url = config.package_url;
    this.client = new ThemeClient(config);
    this.schooljs_version = config.dependencies.schooljs_version;
  }

  deploy (dependencies) {
    this.dependencies = dependencies;
    return this.client.update(this);
  }
}

export default Theme;
