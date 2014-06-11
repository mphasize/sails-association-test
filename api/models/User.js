/**
 * User.js
 *
 * @description :: Our users. At some point we might break the user model apart into basic/required fields and extend info for the profile (which doesn't need to be loaded for every request)
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		title: "string", // honorific or title for this user
		firstname: {
			type: "string",
			required: true
		},
		lastname: {
			type: "string",
			required: true
		},
		email: {
			type: "email",
			required: true,
			unique: true
		},
		password: {
			type: "string",
			required: true
		},
		workspaces: {
			collection: "workspace",
			via: "members",
			through: "membership"
		},

		//Override toJSON method to remove password from API
		toJSON: function () {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
	}

};