const OAuth2Error = require('./OAuth2Error');

function InvalidArgumentsError () {
  OAuth2Error.call(this, 'Invalid arguments', 400, { error: 'bad request' });
}

InvalidArgumentsError.prototype = Object.create(OAuth2Error.prototype);

module.exports = InvalidArgumentsError;
