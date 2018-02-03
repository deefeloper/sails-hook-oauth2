module.exports = function (sails, hook, config) {
  return function (req, res) {
    var grantType = req.param('grant_type');
    var clientId = req.param('client_id');
    var clientSecret = req.param('client_secret');

    if (!grantType) return config.response.fail(res, new Error('Missing grant type'));
    if (grantType !== 'password') return config.response.fail(res, new Error('Invalid grant type'));
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

    function afterAccessToken (client, user, err, accessToken) {
      if (err) return config.response.fail(res, new Error('Error generating access token'));

      if (!config.generateRefreshToken) return supplyAccessToken(accessToken);

      config.generateRefreshToken(client, user, afterRefreshToken.bind(null, accessToken));
    }

    function afterRefreshToken (accessToken, err, refreshToken) {
      if (err) return config.response.fail(res, new Error('Error generating refresh token'));

      supplyTokens(accessToken, refreshToken);
    }

    function afterClientCheck (err, client) {
      if (err) return config.response.fail(res, new Error('Invalid client id or secret'));

      if (client.allowed_grant_types.indexOf(grantType) === -1) return config.response.fail(res, new Error('Invalid grant type for client'));

      var username = req.param('username');
      var password = req.param('password');

      if (!username) return config.response.fail(res, new Error('Missing username'));
      if (!password) return config.response.fail(res, new Error('Missing password'));

      config.checkUserCredentials(username, password, afterUserCheck.bind(null, client));
    }

    function afterUserCheck (client, err, user) {
      if (err) return config.response.fail(res, new Error('Invalid user credentials'));

      config.generateAccessToken(client, user, afterAccessToken.bind(null, client, user));
    }

    config.checkClient(clientId, clientSecret, afterClientCheck);
  }
};
