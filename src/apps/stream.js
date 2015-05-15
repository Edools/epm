import through from 'through2';
import AppHandler from './handler';

export default function edoolsApps(config) {
  return through.obj((file, enc, cb) => {
    AppHandler.deploy(config, [file])
      .then(() => cb(null, file))
      .catch((err) => {
        throw err;
      });
  });
}
