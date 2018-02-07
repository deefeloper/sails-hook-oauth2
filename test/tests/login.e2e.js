describe('Login', function () {
  var clients = {
    passwordOnly: testHelpers.addClient('test-login', 'test-login', ['password']),
    clientCredentialsOnly: testHelpers.addClient('test-login', 'test-login', ['client_credentials'])
  };

  var user = testHelpers.addUser('test-login', 'test-login');

  it('should fail without grant_type', function () {
    return testHelpers
      .postRequest('/oauth2/login', {})
      .then(function (result) {
        assert.equal(result.statusCode, 400);
      })
  });

  it('should fail if client does not permit logging in using username/password', function () {
    return testHelpers
      .postRequest('/oauth2/login', {
        client_id: clients.clientCredentialsOnly.clientId,
        client_secret: clients.clientCredentialsOnly.clientSecret,
        grant_type: 'password'
      })
      .then(function (result) {
        assert.equal(result.statusCode, 400);
      })
  });

  it('should succeed with correct credentials and return tokens', function () {
    return testHelpers
      .postRequest('/oauth2/login', {
        client_id: clients.passwordOnly.clientId,
        client_secret: clients.passwordOnly.clientSecret,
        grant_type: 'password',
        username: user.username,
        password: user.password
      })
      .then(function (result) {
        assert.equal(result.statusCode, 200);

        assert.equal(result.response.token_type, 'bearer');
        assert.isString(result.response.access_token);
        assert.isString(result.response.refresh_token);
      });
  });
});
