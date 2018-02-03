const OAuth2Error = require('./OAuth2Error');

function TokenExpiredError () {
  OAuth2Error.call(this, 'Token expired', 401, { error: 'unauthorized' });
}

TokenExpiredError.prototype = Object.create(OAuth2Error.prototype);

module.exports = TokenExpiredError;
