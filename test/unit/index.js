import { AppHandler, AppStream } from '../../src/index';

describe('Index', () => {
  describe('AppHandler', () => {
    it('should be ok', () => {
      expect(AppHandler).to.be.ok;
    });
  });

  describe('stream', () => {
    it('should be ok', () => {
      expect(AppStream).to.be.ok;
      expect(AppStream).to.be.a('function');
    });
  });
});
