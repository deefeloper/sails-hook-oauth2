function OAuth2Error (message, statusCode, response) {
  statusCode = statusCode || 400;
  response = response || 'bad request';

  Error.call(this, message);

  this.statusCode = statusCode;
  this.response = response;
}

OAuth2Error.prototype = Object.create(Error.prototype);

module.exports = OAuth2Error;
