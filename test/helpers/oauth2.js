var randomString = require('randomstring');

var clients = [];
var users = [];
var accessTokens = [];
var refreshTokens = [];

exports.addClient = function (clientId, clientSecret, allowedGrantTypes) {
  var client = {
    clientId: clientId,
    clientSecret: clientSecret,
    allowedGrantTypes: allowedGrantTypes || ['client_credentials', 'password']
  };

  clients.push(client);

  return client;
};

exports.addUser = function (username, password) {
  var user = {
    username: username,
    password: password || ['']
  };

  users.push(user);

  return user;
};

// OAuth2 hook config

exports.checkClient = function (clientId, clientSecret, cb) {
  for (var i = 0, n = clients.length; i < n; i++) {
    if (clients[i].clientId === clientId) {
      if (clients[i].clientSecret === clientSecret) {
        return cb(null, clients[i]);
      }

      return cb(new Error('Wrong clientSecret'))
    }
  }

  cb(new Error('Wrong clientId'))
};

exports.checkUserCredentials = function (username, password, cb) {
  for (var i = 0, n = users.length; i < n; i++) {
    if (users[i].username === username) {
      if (users[i].password === password) {
        return cb(null, users[i]);
      }

      return cb(new Error('Wrong password'))
    }
  }

  cb(new Error('Wrong username'))
};

exports.generateAccessToken = function (client, user, cb) {
  var accessToken = randomString.generate();

  accessTokens.push({
    client: client,
    user: user,
    accessToken: accessToken
  });

  cb(null, accessToken);

  return accessToken;
};

exports.generateRefreshToken = function (client, user, cb) {
  var refreshToken = randomString.generate();

  refreshTokens.push({
    client: client,
    user: user,
    refreshToken: refreshToken
  });

  cb(null, refreshToken);

  return refreshToken;
};
