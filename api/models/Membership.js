/**
 * Membership
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	tableName: 'workspace_members',
	tables: [ 'user', 'workspace' ],
	junctionTable: true,

	attributes: {
		id: {
			primaryKey: true,
			autoIncrement: true,
			type: 'integer'
		},
		user: {
			columnName: 'user',
			type: 'integer',
			foreignKey: true,
			references: 'user',
			on: 'id',
			via: 'workspace',
			groupBy: 'user'
		},
		workspace: {
			columnName: 'workspace',
			type: 'integer',
			foreignKey: true,
			references: 'workspace',
			on: 'id',
			via: 'user',
			groupBy: 'workspace'
		},
		status: {
			type: "integer",
			maxLength: 1
		}
	}
};