import through from 'through2';
import File from 'vinyl';
import {PluginError} from 'gulp-util';
import AppHandler from './handler';

export default class AppStream {
  static deploy (config) {
    return through.obj((file, enc, cb) => {
      AppHandler.deploy(config, [file])
        .then(() => cb(null, file))
        .catch((err) => {
          throw err;
        });
    });
  }

  static config (manifest) {
    return through.obj(
      function (file, enc, cb) {
        let [prop, extension] = file.relative.split('.');
        if(extension !== 'json') {
          throw new PluginError('epm', 'Config file must be a JSON');
        }

        manifest[prop] = JSON.parse(file.contents.toString());
        cb();
      },
      function (cb) {
        this.push(new File({
          path: 'manifest.json',
          contents: new Buffer(JSON.stringify(manifest))
        }));
        cb();
      }
    );
  }
}
