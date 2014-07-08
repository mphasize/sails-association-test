# Bug demo for Many-to-Many association in Sails.js v.10

This example defines 3 models: User, Workspace and Membership.
The Membership model is used to handle the many-to-many associations between Users and Workspaces and add custom attributes to each association.


### How to produce the error

Not sure if this is a bug or my incomplete understanding of Sails.js, but when you run this demonstration and create a user like this:

    POST /user
    
    {
      "firstname" : "John",
      "lastname"  : "Doe",
      "email"     : "mail@example.com",
      "password"  : "p4ssw0rd",
      "workspaces": []
    }

Sails (or Waterline) will throw an error:

    Error: Unknown rule: through
    at Object.matchRule (/usr/local/share/npm/lib/node_modules/sails/node_modules/anchor/lib/match/matchRule.js:37:11)
    
@particlebanana says that Sails should never even get to validate the `through` property as it should already be parsed out by `waterline-schema`, see discussion here: https://github.com/balderdashy/waterline/pull/444

If I add `through` to the ignored keywords in *waterline/core/validations.js* the error is not thrown and everything works just fine. If I create a workspace first and send a value for workspaces the associations are created.

	POST /user
    
    {
      "firstname" : "John",
      "lastname"  : "Doe",
      "email"     : "mail@example.com",
      "password"  : "p4ssw0rd",
      "workspaces": [1]
    }
    
