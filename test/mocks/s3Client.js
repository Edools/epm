import { EventEmitter } from 'events';

class S3ClientMock extends EventEmitter {
  uploadFile () {
    return this;
  }
}

export default new S3ClientMock();
