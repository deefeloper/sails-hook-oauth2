var Promise = require('bluebird');

exports.request = function (method, url, data, headers) {
  return new Promise(function (resolve) {
    sails.request({
      method: method,
      url: url,
      data: data,
      headers: headers
    }, function (err, res) {
      var response = res && res.body || null;

      try {
        response = JSON.parse(response);
      } catch (e) {}

      resolve({
        statusCode: err && err.status || res.statusCode,
        response: response
      });
    });
  });
};

exports.getRequest = function (url, params) {
  return exports.request('GET', url, params);
};

exports.postRequest = function (url, body) {
  return exports.request('POST', url, body);
};

exports.putRequest = function (url, body) {
  return exports.request('PUT', url, body);
};

exports.patchRequest = function (url, params) {
  return exports.request('PATCH', url, params);
};

exports.deleteRequest = function (url, params) {
  return exports.request('DELETE', url, params);
};
