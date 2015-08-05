import { ThemeClient } from '../../clients';
import R from 'ramda';

class Theme {
  constructor (config) {
    this.id = config.id;
    this.package_url = config.package_url;
    this.client = new ThemeClient(config);
  }

  deploy (dependencies) {
    let schooljs = R.find(R.propEq('app', 'schooljs_version'), dependencies);
    if(schooljs !== undefined) {
      this.schooljs_version = schooljs.version;
    }
    this.dependencies = dependencies.filter(dep => dep.app !== 'schooljs_version');

    return this.client.update(this);
  }
}

export default Theme;
