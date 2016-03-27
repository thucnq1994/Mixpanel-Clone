var moment = require('moment');
var jwt = require('jwt-simple');

function login(req, res){
	var sess = req.session;
	if (sess.current_user) {
		sess.message = { content : 'You are logged in! Do not try to do this again', type : 'danger' };
		res.redirect('/');
	} else {
		res.render('login', { data : req.currentData });
	}
}

function login_POST(req, res){
	var sess = req.session;
	if (sess.current_user) {
		res.json({"error" : true,"message" : "You are logged in! Do not try to do this again!"});
	} else {
		var username = req.body.username;
		var password = require('crypto')
                      .createHash('sha1')
                      .update(req.body.password)
                      .digest('base64');
      	global.Server.Model.UserModel.findOne( {"username" : username, "pwd" : password}, function(err, user) {
			if ( !user ){
				res.json({"error" : true,"message" : "Username and password are incorrect!"});
			} else {
				if ( user ){
					sess.current_user = {
										id: user._id,
										group: user.group,
										displayName: user.name,
										username: user.username
								 	};

					var expires = moment().add('days', 7).valueOf();
					var token = jwt.encode({
					  	iss: user._id,
					  	exp: expires
					}, app.get('jwtTokenSecret'));

					res.json({
						error : false,
					  	token : token
					});
				} else {
					res.json({"error" : true,"message" : "User does not exists"});
				}
			}
		});
	}
}

function logout(req, res){
	req.session.destroy(function(err) {
		if(err) throw err;
		res.redirect('/');
	})
}

function GET(req, res){
	if ( req.user ) { // Kiem tra quyen han
		console.log('You are in cAuth - GET function');
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			global.Server.Model.UserModel.find({}, function(err, data) {
				if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
				res.json(response);
			});
		} else {
			global.Server.Model.UserModel.findById( req.params.id, function(err, user) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( user ){
						response = {"error" : false,"message" : user};
					} else {
						response = {"error" : true,"message" : "User does not exists"};
					}
				}
				res.json(response);
			});
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

function POST(req, res) {
	if ( req.user ) {
		if( typeof req.body.username == 'undefined' || typeof req.body.password == 'undefined' || req.body.username.length == 0 || req.body.password.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
			global.Server.Model.UserModel.findOne( {"username" : req.body.username}, function(err, checkUsername) {
				if ( !checkUsername ){
					var user = global.Server.Model.UserModel({
						"username" : req.body.username,
						"pwd" : require('crypto')
			                          .createHash('sha1')
			                          .update(req.body.password)
			                          .digest('base64'),
						"group" : 1
					});
					user.save(function(err){
						if(err){
							console.log(err);
							response = {"error" : true,"message" : "Error fetching data"};
						} else {
							response = {"error" : false,"message" : "User inserted successfully"};
						}
						res.json(response);
					});
				} else {
					response = {"error" : true,"message" : "Username already exists"};
					res.json(response);
				}
			});
			
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

function PUT(req, res) {
	if ( req.user ) {
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
			global.Server.Model.UserModel.findById( req.params.id, function(err, user) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( user ){
						if(req.body.name !== undefined) {
		                    user.name = req.body.name;
		                }
		                if(req.body.password !== undefined) {
		                    user.pwd = require('crypto')
			                          .createHash('sha1')
			                          .update(req.body.password)
			                          .digest('base64');
		                }
		                // save the data
		                user.save(function(err){
		                    if(err) {
		                        response = {"error" : true,"message" : "Error updating data"};
		                    } else {
		                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
		                    }
		                    res.json(response);
		                })
					} else {
						response = {"error" : true,"message" : "User does not exists"};
						res.json(response);
					}
				}
			});
			
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

function DELETE(req,res){
	var response = {};
	if ( req.user ) {
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
		    // find the data
		    global.Server.Model.UserModel.findById(req.params.id,function(err,data){
		        if(err) {
		            response = {"error" : true,"message" : "Error fetching data"};
		            res.json(response);
		        } else {
		            // data exists, remove it.
		            global.Server.Model.UserModel.remove({_id : req.params.id},function(err){
		                if(err) {
		                    response = {"error" : true,"message" : "Error deleting data"};
		                } else {
		                    response = {"error" : true,"message" : "Data associated with "+req.params.id+" is deleted"};
		                }
		                res.json(response);
		            });
		        }
		    });
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

module.exports.login = login;
module.exports.login_POST = login_POST;
module.exports.logout = logout;
module.exports.POST = POST;
module.exports.GET = GET;
module.exports.PUT = PUT;
module.exports.DELETE = DELETE;