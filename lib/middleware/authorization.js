var TokenExpiredError = require('../errors/TokenExpiredError');

var authorizationHeaderRegex = /^bearer (.+)/i;
var filterAccessToken = function (authorizationHeader) {
  if (!authorizationHeader) return null;

  var matches = authorizationHeaderRegex.exec(authorizationHeader);

  return matches && matches.length >= 2 ? matches[1] : null;
};

module.exports = function (sails, hook, config) {
  return function (req, res, next) {
    req.oAuth = {
      authenticated: false,
      accessToken: filterAccessToken(req.headers.authorization)
    };

    if (!req.oAuth.accessToken) {
      return next();
    }

    function afterAccessTokenCheck (err, authData) {
      if (err) {
        if (err instanceof TokenExpiredError) {
          req.oAuth.expired = true;

          sails.log.verbose('OAuth2 hook', 'access token expired');
        } else {
          sails.log.verbose('OAuth2 hook', 'failed to verify access token');
        }

        sails.log.verbose(req.url);
        sails.log.verbose(req.oAuth);

        return next();
      }

      req.oAuth.authenticated = true;

      Object.keys(authData).forEach(function (key) {
        req.oAuth[key] = authData[key];
      });

      sails.log.verbose('OAuth2 hook', 'verified access token', req.url, req.oAuth);

      next();
    }

    config.verifyAccessToken(req.oAuth.accessToken, afterAccessTokenCheck);
  }
};
