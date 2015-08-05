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
    dependencies = this.depsToArray(dependencies)
      .filter(dep => dep.app !== 'schooljs_version');

    return Q.all(R.map(dep => {
      return this.releaseClient.getOne(dep)
        .then(res => res.entity);
    }, dependencies));
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

    subDeps = R.uniqWith((dep1, dep2) => dep1.app === dep2.app, subDeps);
    subDeps = R.filter(subDep => !R.contains(subDep.app, R.map(R.prop('name'), dependencies)), subDeps);
    return subDeps;
  }
}

export default DepsResolver;
