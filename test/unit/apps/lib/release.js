import Release from '../../../../src/apps/lib/release';
import { appConfig } from '../../../mocks/config';

describe('Release', () => {
  var release;
  beforeEach(() => {
    release = new Release(appConfig);
  });

  it('should be ok', () => {
    expect(release).to.be.ok;
    expect(release.app).to.equal(appConfig.app);
    expect(release.version).to.equal(appConfig.manifest.version);
    expect(release.dependencies).to.equal(appConfig.manifest.dependencies);
    expect(release.routes).to.equal(appConfig.manifest.routes);
  });

  it('should verify if it already exists', (done) => {
    release.client.getOne = stub().resolves({ entity: 'myrelease' });
    expect(release.exists()).to.be.fulfilled.and.notify(done);
  });

  it('should verify if it doesn\'t exist', (done) => {
    release.client.getOne = stub().rejects({ statusCode: 404 });
    expect(release.exists()).to.be.rejected.and.notify(done);
  });

  it('should update the release when it exists', (done) => {
    release.client.getOne = stub().resolves({ entity: 'myrelease' });
    release.client.update = stub().resolves(204);

    release.save()
      .then(() => {
        expect(release.client.update).to.have.been.called;
        done();
      });
  });

  it('should create the release when it doesn\'t exist', (done) => {
    release.client.getOne = stub().rejects({ statusCode: 404 });
    release.client.create = stub().resolves(201);

    release.save()
      .then(() => {
        expect(release.client.create).to.have.been.called;
        done();
      });
  });
});
