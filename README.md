# Bug demo for .update() Many-to-Many Through association in Sails.js v.10

This example defines 3 models: User, Workspace and Membership.
The Membership model is used to handle the many-to-many associations between Users and Workspaces and add custom attributes to each association.


### How to produce the error

First create a few users and a workspace, then try to update the relationship like this


    POST /workspace/1
    
    {
      "members": [1,3,4]
    }

Waterline will throw a WLError:

    { type: 'insert',
    collection: 'membership',
    criteria: { user: 1, undefined: 1 },
    values: { user: 1, undefined: 1 },
    err: [Error: Trying to '.add()' an instance which already exists!] }
    
Debugging the app reveals an error in `waterline/model/lib/associationMethods/add.js` in Line 289 the variable `attribute` has no property `onKey` therefore the criteria object gets assigned **undefined**.

[PR #507](https://github.com/balderdashy/waterline/pull/507) fixes this issue.

### Note

While trying to reproduce the error, this project was originally using Waterline RC12 – and working. There seems to be a regression between RC12 and RC15 that introduces this error.
