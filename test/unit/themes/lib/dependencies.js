import DepsResolver from '../../../../src/themes/lib/dependencies';
import { themeConfig } from '../../../mocks/config';

describe('Dependencies', () => {
  var dependencies, arrayDeps, depsResolver;
  beforeEach(() => {
    dependencies = {
      home: '0.8.0-beta.49',
      ecommerce: '0.8.0-beta.49'
    };

    arrayDeps = [{
      app: 'home',
      version: '0.8.0-beta.49',
      dependencies: {
        auth: '0.8.0'
      }
    }, {
      app: 'ecommerce',
      version: '0.8.0-beta.49',
      dependencies: {
        auth: '0.8.0'
      }
    }];

    depsResolver = new DepsResolver(themeConfig);
  });

  it('should be ok', () => {
    expect(depsResolver).to.be.ok;
  });

  it('should transform dependencies object into array', () => {
    let result = depsResolver.depsToArray(dependencies);

    expect(result).to.be.an('array');
    expect(result[0].app).to.equal('home');
    expect(result[0].version).to.equal('0.8.0-beta.49');
    expect(result[1].app).to.equal('ecommerce');
    expect(result[1].version).to.equal('0.8.0-beta.49');
  });

  it('should get detailed dependencies', (done) => {
    depsResolver.getDeps(dependencies)
      .then(deps => {
        expect(deps).to.be.an('array');
        done();
      });
  });

  it('should format array dependencies into object', () => {
    expect(depsResolver.format(arrayDeps)).to.deep.equal({
      auth: '0.8.0',
      home: '0.8.0-beta.49',
      ecommerce: '0.8.0-beta.49'
    });
  });

  it('should get all sub dependencies from dependencies array', () => {
    expect(depsResolver.getSubDeps(arrayDeps)).to.deep.equal([{ app: 'auth', version: '0.8.0' }]);
  });
});
