var TokenExpiredError = require('../errors/TokenExpiredError');

module.exports = function (sails, hook, config) {
  return function (req, res) {
    var grantType = req.param('grant_type');
    var clientId = req.param('client_id');
    var clientSecret = req.param('client_secret');

    if (!grantType) return config.response.fail(res, new Error('Missing grant type'));
    if (['client_credentials', 'refresh_token'].indexOf(grantType) === -1) return config.response.fail(res, new Error('Invalid grant type'));
    if (!clientId) return config.response.fail(res, new Error('Missing client id'));
    if (!clientSecret) return config.response.fail(res, new Error('Missing client secret'));

    function supplyTokens (accessToken, refreshToken) {
      var retVal = {
        access_token: accessToken,
        token_type: 'bearer'
      };

      if (refreshToken) retVal.refresh_token = refreshToken;

      config.response.setHeader(res, 'Cache-Control', 'no-store');
      config.response.setHeader(res, 'Pragma', 'no-cache');

      config.response.ok(res, retVal);
    }

    function afterAccessToken (client, skipRefreshToken, err, accessToken) {
      if (err) return config.response.fail(res, new Error('Error generating access token'));

      if (!config.generateRefreshToken || skipRefreshToken) return supplyTokens(accessToken);

      config.generateRefreshToken(client, null, afterRefreshToken.bind(null, accessToken));
    }

    function afterRefreshToken (accessToken, err, refreshToken) {
      if (err) return config.response.fail(res, new Error('Error generating refresh token'));

      supplyTokens(accessToken, refreshToken);
    }

    function afterRefreshTokenCheck(client, err, user) {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return config.response.unAuthorized(res, err);
        }

        return config.response.fail(res, new Error('Invalid refresh token'));
      }

      config.generateAccessToken(client, user || null, afterAccessToken.bind(null, client, true));
    }

    function afterClientCheck (err, client) {
      if (err) return config.response.fail(res, new Error('Invalid client id or secret'));

      if (grantType === 'client_credentials') {
        if (client.allowedGrantTypes.indexOf(grantType) === -1) return config.response.fail(res, new Error('Invalid grant type for client'));

        return config.generateAccessToken(client, null, afterAccessToken.bind(null, client, false));
      }

      // NOTE: grantType can only be refresh_token or client_credentials, review this when that changes

      var refreshToken = req.param('refresh_token');

      if (!refreshToken) return config.response.fail(res, new Error('Missing refresh token'));

      config.verifyRefreshToken(client, refreshToken, afterRefreshTokenCheck.bind(null, client));
    }

    config.checkClient(clientId, clientSecret, afterClientCheck);
  };
};
