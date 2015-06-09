import { Source, Release } from '../../../../src/apps/lib';
import { appConfig } from '../../../mocks/config';
import s3ClientMock from '../../../mocks/s3Client';
import File from 'vinyl';

describe('Source', () => {
  var source, release, file;
  beforeEach(() => {
    file = new File({
      cwd: '/',
      base: '/test/',
      path: '/test/home.min.js',
      contents: new Buffer('var a = "b";')
    });

    release = new Release(appConfig);
    source = new Source(file, release, appConfig);
    source.client = s3ClientMock;
  });

  it('should be ok', () => {
    expect(source).to.be.ok;
  });

  it('should mount the s3 remote url', () => {
    expect(source.remoteKey).to.equal('libs/edools-school/home/10.10.0/home.min.js');
  });

  it('should upload a file', (done) => {
    let promise = source.upload();

    expect(promise).to.be.fulfilled.and.notify(done);
    s3ClientMock.emit('end');
  });

  it('should record progress for a file upload', (done) => {
    let currentProgress = 40;
    source.upload()
      .progress((current) => {
        expect(current).to.equal(currentProgress);
        done();
      });

    s3ClientMock.progressAmount = currentProgress;
    s3ClientMock.emit('progress');
  });

  it('should handle upload error', (done) => {
    let promise = source.upload();

    expect(promise).to.be.rejected.and.notify(done);
    s3ClientMock.emit('error');
  });
});
