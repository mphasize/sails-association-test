/**
 * UserController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	verify: function ( req, res ) {
		var id = req.param( "id" ),
			hash = req.param( "hash" );

		User.findOne( {
			id: id
		} ).exec( function ( err, user ) {
			if ( err ) {
				res.serverError( {
					error: Translate.__( "Sorry, but we cannot find the user you want to verify" )
				} );
			}
			var check = EmailVerification.verifyHash( hash, user.email, user.createdAt );
			if ( check ) {
				user.email_verified = true;
				user.save( function ( err, savedUser ) {
					if ( err ) {
						sails.log.error( err );
						res.serverError( {
							error: Translate.__( "Failed to update the user account." )
						} );
					}

					// update the user data in the session
					if ( req.isAuthenticated() ) {
						req.login( savedUser, function ( err ) {
							if ( err ) {
								sails.log.error( "Failed to update user session after email verification." );
							}
						} );
					}

					// email successfully verified, send user to login OR dashboard with message
					req.flash( 'message', {
						type: "success",
						text: Translate.__( "Email successfully verified" )
					} );
					res.redirect( '/signin/' );
				} );
			} else {
				//res.send( "Email verification failed" );
				res.badRequest( Translate.__( 'Email verification failed' ) );
			}

		} );
	},

	"uploadPicture": function ( req, res ) {
		if ( req.user && req.rawBody && req.headers[ 'x-file-type' ] ) {
			var fs = require( 'fs' ),
				gm = require( 'gm' );
			var im = gm.subClass( {
				imageMagick: true
			} );

			var thumbSize = 120;

			Media.create( {
				user : req.user.id,
				title: req.user.firstname + ' ' + req.user.lastname,
				mime: req.headers[ 'x-file-type' ]
			} ).exec( function ( err, media ) {
				// Error handling
				if ( err ) {
					err.debug = "Could not create media in database";
					res.json( {
						errors: err
					}, 500 );
				}

				var updateUser = function ( media ) {
					User.update( req.user.id, {
						picture: media.id
					}, function ( err, user ) {
						if ( err ) return res.serverError("Could not update user picture in database");

						media.previewAt = '/media/userpicture/' + media.id;
						return res.json( media );

					} );
				};

				var img = im( req.rawBody );
				Storage.media.save( media.id, img, "original", function ( err ) {
					if ( err ) return res.negotiate( err );
					Storage.media.save( media.id, img, "userpicture", function ( err ) {
						if ( err ) return res.serverError( "Could not save media file" );
						updateUser( media );
					} );
				} );

			} );

			/* fs.writeFile("storage/userprofiles/" + req.session.user.id, req.rawBody, 'base64', function (err) {
        console.log(err);
      }); */

			//console.log(req.rawBody);
		} else {
			res.json( {
				errors: [ 'No files received' ]
			}, 404 );
		}
	}

};
