var OAuth2Error = require('../errors/OAuth2Error');
var TokenExpiredError = require('../errors/TokenExpiredError');
var InvalidArgumentsError = require('../errors/InvalidArgumentsError');

module.exports = function (sails, hook, config) {
  return function (req, res) {
    var grantType = req.param('grant_type');
    var clientId = req.param('client_id');
    var clientSecret = req.param('client_secret');
    var scope = req.param('scope');

    if (!grantType) {
      return config.response.fail(res, new InvalidArgumentsError('Missing grant type'));
    }
    if (['client_credentials', 'refresh_token'].indexOf(grantType) === -1) {
      return config.response.fail(res, new InvalidArgumentsError('Invalid grant type'));
    }
    if (!clientId) {
      return config.response.fail(res, new InvalidArgumentsError('Missing client id'));
    }
    if (!clientSecret) {
      return config.response.fail(res, new InvalidArgumentsError('Missing client secret'));
    }

    function supplyTokens (accessToken, expiresIn, refreshToken) {
      var retVal = {
        access_token: accessToken,
        token_type: 'bearer'
      };

      if (refreshToken) {
        retVal.refresh_token = refreshToken;
      }

      if (expiresIn) {
        retVal.expires_in = expiresIn;
      }

      config.response.setHeader(res, 'Cache-Control', 'no-store');
      config.response.setHeader(res, 'Pragma', 'no-cache');

      config.response.ok(res, retVal);
    }

    function afterAccessToken (client, skipRefreshToken, err, accessToken, expiresIn) {
      if (err) {
        return config.response.fail(res, new OAuth2Error('Error generating access token'));
      }

      if (!config.generateRefreshToken || skipRefreshToken) return supplyTokens(accessToken, expiresIn);

      config.generateRefreshToken({ client }, afterRefreshToken.bind(null, accessToken, expiresIn));
    }

    function afterRefreshToken (accessToken, expiresIn, err, refreshToken) {
      if (err) {
        return config.response.fail(res, new OAuth2Error('Error generating refresh token'));
      }

      supplyTokens(accessToken, expiresIn, refreshToken);
    }

    function afterRefreshTokenCheck(client, err, user) {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return config.response.unAuthorized(res, err);
        }

        return config.response.fail(res, new OAuth2Error('Invalid refresh token'));
      }

      config.generateAccessToken({ client, user: user || null, scope }, afterAccessToken.bind(null, client, true));
    }

    function afterClientCheck (err, client) {
      if (err) {
        return config.response.fail(res, new OAuth2Error('Invalid client id or secret'));
      }

      if (grantType === 'client_credentials') {
        if (client.allowedGrantTypes.indexOf(grantType) === -1) return config.response.fail(res, new OAuth2Error('Invalid grant type for client'));

        return config.generateAccessToken({ client, user: null, scope }, afterAccessToken.bind(null, client, false));
      }

      // NOTE: grantType can only be refresh_token or client_credentials, review this when that changes

      var refreshToken = req.param('refresh_token');

      if (!refreshToken) {
        return config.response.fail(res, new OAuth2Error('Missing refresh token'));
      }

      config.verifyRefreshToken(client, refreshToken, afterRefreshTokenCheck.bind(null, client))
    }

    config.checkClient(clientId, clientSecret, afterClientCheck);
  }
};
