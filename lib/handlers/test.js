module.exports = function (sails, hook, config) {
  return function (req, res) {
    config.response.ok(res, {
      'req.oAuth': req.oAuth,
      'req.url': req.url
    });
  };
};
