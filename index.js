module.exports = function (sails) {
  var hook;

  return {
    defaults: require('./lib/defaultConfig'),
    initialize: function (done) {
      hook = this;

      sails.on('router:before', function () {
        // Only the login and token routes are implemented, we will implement other routes when needed
        sails.router.bind('POST /oauth2/login', require('./lib/handlers/login')(sails, hook, sails.config[hook.configKey]));
        sails.router.bind('POST /oauth2/token', require('./lib/handlers/token')(sails, hook, sails.config[hook.configKey]));

        sails.router.bind('GET,POST,PATCH,PUT,DELETE r|\\^\\/\\(\\?\\!oauth2\\/\\)|', require('./lib/middleware/authorization')(sails, hook, sails.config[hook.configKey]));

        sails.log.verbose('OAuth2 hook', 'loaded server routes and auth middleware');

        if (sails.config.environment !== 'production') {
          sails.router.bind('ALL /oauth2-test', require('./lib/handlers/test')(sails, hook, sails.config[hook.configKey]));

          sails.log.verbose('OAuth2 hook', 'loaded test route');
        }
      });

      done();
    }
  };
};
