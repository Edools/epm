var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('s3'), require('q'), require('rest'), require('rest/interceptor/pathPrefix'), require('rest/interceptor/mime'), require('rest/interceptor/defaultRequest'), require('rest/interceptor/errorCode'), require('ramda'), require('through2')) : typeof define === 'function' && define.amd ? define(['exports', 's3', 'q', 'rest', 'rest/interceptor/pathPrefix', 'rest/interceptor/mime', 'rest/interceptor/defaultRequest', 'rest/interceptor/errorCode', 'ramda', 'through2'], factory) : factory(global.index.js = {}, global.s3, global.Q, global.rest, global.pathPrefix, global.mime, global.defaultRequest, global.errorCode, global.R, global.through);
})(this, function (exports, s3, Q, rest, pathPrefix, mime, defaultRequest, errorCode, R, through) {
  'use strict';

  Q = 'default' in Q ? Q['default'] : Q;
  rest = 'default' in rest ? rest['default'] : rest;
  pathPrefix = 'default' in pathPrefix ? pathPrefix['default'] : pathPrefix;
  mime = 'default' in mime ? mime['default'] : mime;
  defaultRequest = 'default' in defaultRequest ? defaultRequest['default'] : defaultRequest;
  errorCode = 'default' in errorCode ? errorCode['default'] : errorCode;
  R = 'default' in R ? R['default'] : R;
  through = 'default' in through ? through['default'] : through;

  var Source = (function () {
    function Source(file, release, config) {
      _classCallCheck(this, Source);

      this.file = file;
      this.release = release;
      this.config = config;
      this.client = this.createS3Client(config);
    }

    _createClass(Source, [{
      key: 'remoteKey',
      get: function () {
        var release = this.release;
        return 'libs/edools-school/' + release.app + '/' + release.version + '/' + this.file.relative;
      }
    }, {
      key: 'createS3Client',
      value: function createS3Client(config) {
        return s3.createClient({
          s3Options: config.s3Options
        });
      }
    }, {
      key: 'upload',
      value: function upload() {
        var deferred = Q.defer();
        var uploader = this.client.uploadFile({
          localFile: this.file.base + this.file.relative,
          s3Params: {
            Bucket: this.config.s3Options.bucket,
            Key: this.remoteKey,
            ACL: 'public-read'
          }
        });

        uploader.on('progress', function () {
          deferred.notify(uploader.progressAmount);
        });
        uploader.on('error', deferred.reject);
        uploader.on('end', deferred.resolve);

        return deferred.promise;
      }
    }]);

    return Source;
  })();

  function getDefaultHeaders(config) {
    return {
      Accept: 'application/vnd.edools.themes.v1+json',
      Authorization: 'Token token=' + config.token
    };
  }

  function restClient(config) {
    return rest.wrap(mime).wrap(pathPrefix, { prefix: 'https://api.myedools.com' }).wrap(defaultRequest, { headers: getDefaultHeaders(config) }).wrap(errorCode, { code: 400 }).wrap(errorCode, { code: 404 }).wrap(errorCode, { code: 500 });
  }

  var ThemeClient = (function () {
    function ThemeClient(config) {
      _classCallCheck(this, ThemeClient);

      this.client = restClient(config);
    }

    _createClass(ThemeClient, [{
      key: 'update',
      value: function update(theme) {
        return this.client({
          method: 'PUT',
          path: '/themes/' + theme.id,
          entity: { theme: theme },
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }]);

    return ThemeClient;
  })();

  var ReleaseClient = (function () {
    function ReleaseClient(config) {
      _classCallCheck(this, ReleaseClient);

      this.client = restClient(config);
    }

    _createClass(ReleaseClient, [{
      key: 'getOne',
      value: function getOne(release) {
        return this.client('/apps/' + release.app + '/releases/' + release.version);
      }
    }, {
      key: 'getList',
      value: function getList(app) {
        return this.client('/apps/' + app + '/releases');
      }
    }, {
      key: 'create',
      value: function create(release) {
        return this.client({
          method: 'POST',
          path: '/apps/' + release.app + '/releases',
          entity: { app_release: release },
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }, {
      key: 'update',
      value: function update(release) {
        return this.client({
          method: 'PUT',
          path: '/apps/' + release.app + '/releases/' + release.version,
          entity: { app_release: release },
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }, {
      key: 'remove',
      value: function remove(release) {
        return this.client({
          method: 'DELETE',
          path: '/apps/' + release.app + '/releases/' + release.version
        });
      }
    }]);

    return ReleaseClient;
  })();

  var Release = (function () {
    function Release(config) {
      _classCallCheck(this, Release);

      _Object$assign(this, { app: config.app });
      _Object$assign(this, config.manifest);
      this.client = new ReleaseClient(config);
    }

    _createClass(Release, [{
      key: 'save',
      value: function save() {
        var _this = this;

        return this.exists().then(function () {
          return _this.client.update(_this);
        })['catch'](function () {
          return _this.client.create(_this);
        });
      }
    }, {
      key: 'exists',
      value: function exists() {
        var deferred = Q.defer();

        this.client.getOne(this).then(deferred.resolve)['catch'](deferred.reject);

        return deferred.promise;
      }
    }]);

    return Release;
  })();

  var AppHandler = (function () {
    function AppHandler() {
      _classCallCheck(this, AppHandler);
    }

    _createClass(AppHandler, null, [{
      key: 'deploy',
      value: function deploy(config, files) {
        var release = new Release(config),
            sources = R.map(function (file) {
          return new Source(file, release, config);
        }, files);

        return Q.all(R.map(function (source) {
          return source.upload();
        }, sources)).then(function () {
          return release.save();
        });
      }
    }]);

    return AppHandler;
  })();

  exports.AppHandler = AppHandler;

  function edoolsApps(config) {
    return through.obj(function (file, enc, cb) {
      AppHandler.deploy(config, [file]).then(function () {
        return cb(null, file);
      })['catch'](function (err) {
        throw err;
      });
    });
  }

  exports.AppStream = edoolsApps;

  var Theme = (function () {
    function Theme(config) {
      _classCallCheck(this, Theme);

      this.id = config.id;
      this.package_url = config.package_url;
      this.client = new ThemeClient(config);
    }

    _createClass(Theme, [{
      key: 'deploy',
      value: function deploy(dependencies) {
        var schooljs = R.find(R.propEq('app', 'schooljs_version'), dependencies);
        if (schooljs !== undefined) {
          this.schooljs_version = schooljs.version;
        }
        this.dependencies = dependencies.filter(function (dep) {
          return dep.app !== 'schooljs_version';
        });

        return this.client.update(this);
      }
    }]);

    return Theme;
  })();

  var DepsResolver = (function () {
    function DepsResolver(config) {
      _classCallCheck(this, DepsResolver);

      this.releaseClient = new ReleaseClient(config);
    }

    _createClass(DepsResolver, [{
      key: 'resolve',
      value: function resolve(dependencies) {
        var _this2 = this;

        return this.getDeps(dependencies).then(function (deps) {
          return _this2.format(deps);
        });
      }
    }, {
      key: 'getDeps',
      value: function getDeps(dependencies) {
        var _this3 = this;

        return Q.all(R.map(function (dep) {
          return _this3.releaseClient.getOne(dep).then(function (res) {
            return res.entity;
          });
        }, this.depsToArray(dependencies)));
      }
    }, {
      key: 'depsToArray',
      value: function depsToArray(dependencies) {
        return R.map(function (key) {
          return { app: key, version: dependencies[key] };
        }, R.keys(dependencies));
      }
    }, {
      key: 'format',
      value: function format(dependencies) {
        dependencies = R.concat(dependencies, this.getSubDeps(dependencies));

        return R.reduce(function (acc, dep) {
          acc[dep.app || dep.name] = dep.version;
          return acc;
        }, {}, dependencies);
      }
    }, {
      key: 'getSubDeps',
      value: function getSubDeps(dependencies) {
        var _this4 = this;

        var subDeps = R.reduce(function (acc, dep) {
          return R.concat(acc, _this4.depsToArray(dep.dependencies));
        }, [], dependencies);

        subDeps = R.uniqWith(function (dep1, dep2) {
          return dep1.app === dep2.app;
        }, subDeps);
        subDeps = R.filter(function (subDep) {
          return !R.contains(subDep.app, R.map(R.prop('name'), dependencies));
        }, subDeps);
        return subDeps;
      }
    }]);

    return DepsResolver;
  })();

  var ThemeHandler = (function () {
    function ThemeHandler() {
      _classCallCheck(this, ThemeHandler);
    }

    _createClass(ThemeHandler, null, [{
      key: 'deploy',
      value: function deploy(config) {
        var theme = new Theme(config),
            depsResolver = new DepsResolver(config);

        return depsResolver.resolve(config.dependencies).then(function (dependencies) {
          return theme.deploy(dependencies);
        })['catch'](function (err) {
          throw err;
        });
      }
    }]);

    return ThemeHandler;
  })();

  exports.ThemeHandler = ThemeHandler;
});
//# sourceMappingURL=./index.js.map