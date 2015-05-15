import { ReleaseClient } from '../../../../src/clients';
import { appConfig } from '../../../mocks/config';

describe('ReleaseClient', () => {
  var client, release;
  beforeEach(() => {
    client = new ReleaseClient(appConfig);
    release = {
      app: 'home',
      version: '99.0.0',
      dependencies: {
        'auth': 'latest'
      },
      routes: [{
        url: '/myroute'
      }]
    };
  });

  it('should be ok', () => {
    expect(client).to.be.ok;
  });

  it('should get release list', (done) => {
    client.getList('home')
      .then((res) => {
        expect(res.entity).to.have.a.property('app_releases');
        expect(res.entity.app_releases).to.be.an('array');
        done();
      });
  });

  it('should create a release', (done) => {
    let promise = client.create(release);
    expect(promise).to.be.fulfilled.and.notify(done);
  });

  it('should get a single release', (done) => {
    client.getOne(release)
      .then((res) => {
        expect(res.entity).to.be.ok;
        expect(res.entity.version).to.equal(release.version);
        done();
      });
  });

  it('should update a release', (done) => {
    let promise = client.update(release);
    expect(promise).to.be.fulfilled.and.notify(done);
  });

  it('should remove a release', (done) => {
    let promise = client.remove(release);
    expect(promise).to.be.fulfilled.and.notify(done);
  });
});
