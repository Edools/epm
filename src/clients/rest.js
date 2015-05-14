import rest from 'rest';
import pathPrefix from 'rest/interceptor/pathPrefix';
import mime from 'rest/interceptor/mime';
import defaultRequest from 'rest/interceptor/defaultRequest';
import errorCode from 'rest/interceptor/errorCode';

function getDefaultHeaders(config) {
  return {
    Accept: 'application/vnd.edools.themes.v1+json',
    Authorization: `Token token=${config.token}`
  };
}

export default function restClient(config) {
  return rest.wrap(mime)
             .wrap(pathPrefix, { prefix: 'https://api.myedools.com' })
             .wrap(defaultRequest, { headers: getDefaultHeaders(config) })
             .wrap(errorCode, { code: 400 })
             .wrap(errorCode, { code: 404 })
             .wrap(errorCode, { code: 500 });
}
