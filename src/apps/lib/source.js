import { createClient } from 's3';
import Q from 'q';

class Source {
  constructor (file, release, config) {
    this.file        = file;
    this.release     = release;
    this.config      = config;
    this.client      = this.createS3Client(config);
  }

  get remoteKey () {
    return `libs/edools-school/${this.release.app}/${this.release.version}/${this.file.relative}`;
  }

  createS3Client (config) {
    return createClient({
      s3Options: config.s3Options
    });
  }

  upload () {
    let deferred = Q.defer();
    let uploader = this.client.uploadFile({
      localFile: this.file.base + this.file.relative,
      s3Params: {
        Bucket: this.config.s3Options.bucket,
        Key: this.remoteKey,
        ACL: 'public-read'
      }
    });

    uploader.on('progress', () => {
      deferred.notify(uploader.progressAmount);
    });
    uploader.on('error', deferred.reject);
    uploader.on('end', deferred.resolve);

    return deferred.promise;
  }
}

export default Source;
