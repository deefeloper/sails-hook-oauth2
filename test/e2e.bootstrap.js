var chai = require('chai');
var assert = chai.assert;
var Sails = require('sails');

global.testHelpers = Object.assign(
  {},
  require('./helpers/request'),
  require('./helpers/oauth2')
);

var sailsConfig = {
  log: {
    level: 'error'
  },
  oauth2: require('./helpers/oauth2'),
  hooks: {
    'oauth2': require('../'),
    'grunt': false
  }
};

global.assert = assert;

before(function (done) {
  Sails.load(sailsConfig, function (err) {
    if (err) return done(err);

    done(err, sails);
  });
});

after(function (done) {
  if (!sails) return done();

  sails.lower(done);
});
