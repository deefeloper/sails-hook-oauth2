# sails-hook-oauth2
An OAuth2 implementation for sails

For now only the `login` and `token` routes have been implemented as they're used the most

This package also includes some middleware that verifies the access token in the authorization header

**Note:** The version major had to be increased to v1.0 as the npm package was taken over

In the next few weeks I will write the readme

**Todo's for first stable release (v1.5):**
 - Write readme
 - Write some tests
 - Add some basic policies to be used in sails
 - Add example configs and policies

**Todo's for future releases:**
 - Add the other OAuth2 routes (like `authorize`)
