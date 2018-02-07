module.exports = exports = {
  __configKey__: {
    response: {
      setHeader: function (res, key, val) {
        res.set(key, val);
      },
      ok: function (res, data) {
        res.ok(data);
      },
      fail: function (res, data) {
        res.badRequest(data);
      },
      forbidden: function (res, data) {
        res.forbidden(data);
      },
      unAuthorized: function (res, data) {
        res.forbidden(data);
      }
    },

    /**
     *
     * @param clientId
     * @param clientSecret
     * @param cb - (err, client { allowedGrantTypes })
     */
    checkClient: function (clientId, clientSecret, cb) {
      cb(null, { allowedGrantTypes: ['password'] });
    },

    /**
     *
     * @param username
     * @param password
     * @param cb - (err, Object<user>)
     */
    checkUserCredentials: function (username, password, cb) {
      cb(new Error('Not implemented'));
    },

    /**
     *
     * @param client
     * @param user
     * @param cb - (err, {string} accessToken)
     */
    generateAccessToken: function (client, user, cb) {
      cb(new Error('Not implemented'));
    },

    /**
     *
     * @param client
     * @param user
     * @param cb - (err, {string} refreshToken)
     */
    generateRefreshToken: function (client, user, cb) {
      cb(null, null);
    },

    /**
     *
     * @param accessToken
     * @param cb - (err, Object<addToAuthObject>)
     */
    verifyAccessToken: function (accessToken, cb) {
      cb(new Error('Not implemented'));
    },

    /**
     *
     * @param client
     * @param refreshToken
     * @param cb - (err, Object<user>)
     */
    verifyRefreshToken: function (client, refreshToken, cb) {
      cb(new Error('Not implemented'));
    }
  }
};
