# sails-hook-oauth2
An OAuth2 implementation for sails

For now only the `login` and `token` routes have been implemented as they're used the most

This package also includes some middleware that verifies the access token in the authorization header

**Note:** The version major had to be increased to v1.0 as the npm package was taken over

In the next few weeks I will write the readme

# Features
 - Basic routes for logging in and using refresh token to generate a new access token
 - Middleware to check credentials given

# Installation
 - install using npm (`npm install sails-hook-oauth2`)
 - set up a config like shown in `lib/defaultConfig.js` (a real example config will follow later)
 
# Usage (middleware)

Every route that does not start with `/oauth2/` will automatically run the middleware before going further on to policies and controllers (todo: make this a config option)

The middleware extends the `req` object by adding an `oAuth` object.

`req.oAuth` contains the following properties:
 - `authenticated` bool - will only be set to true if the callback from `verifyAccessToken` does not give an error
 - `accessToken` string - contains the access token the middleware found (in the `Authorization` header)

In addition to these when the callback from `verifyAccessToken` supplies an object for the authData parameter, all these properties will be added to `req.oAuth`


# Todo's
## for first stable release (v1.5):
 - Write readme
   - Write about `login` and `token` routes
   - Describe all config properties
 - Write some tests
 - Add some basic policies to be used in sails
 - Add example configs and policies

## for future releases:
 - Add the other OAuth2 routes (like `authorize`)
