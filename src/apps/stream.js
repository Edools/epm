import through from 'through2';
import path from 'path';
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
    let latestFile;
    return through.obj(
      function (file, enc, cb) {
        let [prop, extension] = file.relative.split('.');
        if(extension !== 'json') {
          throw new PluginError('epm', 'Config file must be a JSON');
        }

        manifest[prop] = JSON.parse(file.contents.toString());
        latestFile = file;

        cb();
      },
      function (cb) {
        if(latestFile) {
          let finalFile = latestFile.clone({contents: false});
          finalFile.path = path.join(latestFile.base, 'manifest.json');
          finalFile.contents = new Buffer(JSON.stringify(manifest));

          this.push(finalFile);
        }

        cb();
      }
    );
  }
}
