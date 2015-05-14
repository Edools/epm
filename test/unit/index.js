import { AppHandler, stream } from '../../src/index';

describe('Index', () => {
  describe('AppHandler', () => {
    it('should be ok', () => {
      expect(AppHandler).to.be.ok;
    });
  });

  describe('stream', () => {
    it('should be ok', () => {
      expect(stream).to.be.ok;
      expect(stream).to.be.a('function');
    });
  });
});
