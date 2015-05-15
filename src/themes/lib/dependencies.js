import ReleaseClient from '../../clients/release';
import Q from 'q';
import R from 'ramda';

/*
 TOOD: implement conflict checking
 TOOD: implement latest version fetching
*/
class DepsResolver {
  constructor (config) {
    this.releaseClient = new ReleaseClient(config);
  }

  resolve (dependencies) {
    return this.getDeps(dependencies)
      .then(deps => this.format(deps));
  }

  getDeps (dependencies) {
    return Q.all(R.map(dep => {
      return this.releaseClient.getOne(dep)
        .then(res => res.entity);
    }, this.depsToArray(dependencies)));
  }

  depsToArray (dependencies) {
    return R.map(key => {
      return { app: key, version: dependencies[key] };
    }, R.keys(dependencies));
  }

  format (dependencies) {
    dependencies = R.concat(dependencies, this.getSubDeps(dependencies));

    return R.reduce((acc, dep) => {
      acc[dep.app || dep.name] = dep.version;
      return acc;
    }, {}, dependencies);
  }

  getSubDeps (dependencies) {
    let subDeps = R.reduce((acc, dep) => {
      return R.concat(acc, this.depsToArray(dep.dependencies));
    }, [], dependencies);

    return R.dropRepeatsWith((dep1, dep2) => dep1.app === dep2.app, subDeps);
  }
}

export default DepsResolver;
