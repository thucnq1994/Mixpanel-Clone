function GETByUserID(req, res){
	var response = {};
	if ( 1==1 ) { // Kiem tra quyen han
		// ID is exists, GET detail by ID
		global.Server.Model.ProjectModel.find({"user" : req.params.id}, function(err, user) {
			if(err) {
                res.json({"error" : true,"message" : "Error fetching data"});
            } else {
				if ( user ){
					response = {"error" : false,"message" : user};
				} else {
					response = {"error" : true,"message" : "Project does not exists"};
				}
			}
			res.json(response);
		});
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}


function GET(req, res){
	var response = {};
	if ( 1==1 ) { // Kiem tra quyen han
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			global.Server.Model.ProjectModel.find({}, function(err, data) {
				if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
				res.json(response);
			});
		} else {
			// ID is exists, GET detail by ID
			global.Server.Model.ProjectModel.findById( req.params.id, function(err, project) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( project ){
						response = {"error" : false,"message" : project};
					} else {
						response = {"error" : true,"message" : "Project does not exists"};
					}
					res.json(response);
				}
			});
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

function POST(req, res){
	if ( 1==1 ){
		if( typeof req.body.name == 'undefined' || req.body.name.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
			var project = global.Server.Model.ProjectModel();
			project.name = req.body.name;
			project.user = "56f0ff622f6d73263aa3d25d";
			project.save(function(err){
				if(err){
					throw err;
					response = {"error" : true,"message" : "Error when inserting data"};
				} else {
					response = {"error" : false,"message" : "Project inserted successfully"};
				}
				res.json(response);
			});
		}
	} else {
		response = { "error": true, "message": "You dont have permission to do this action!"}
		res.json(response);
	}
}

function PUT(req, res) {
	if ( 1==1 ) {
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
			global.Server.Model.ProjectModel.findById( req.params.id, function(err, user) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( user ){
						if(req.body.name !== undefined) {
		                    user.name = req.body.name;
		                }
						if(req.body.url !== undefined) {
		                    user.url = req.body.url;
		                }
						if(req.body.timezone !== undefined) {
		                    user.timezone = req.body.timezone;
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
						response = {"error" : true,"message" : "Project does not exists"};
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
	if ( 1==1 ) {
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
		    // find the data
		    global.Server.Model.ProjectModel.findById(req.params.id,function(err,data){
		        if(err) {
		            response = {"error" : true,"message" : "Error fetching data"};
		            res.json(response);
		        } else {
		            // data exists, remove it.
		            global.Server.Model.ProjectModel.remove({_id : req.params.id},function(err){
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

function CREATE(req, res){
	var sess = req.session;
	if (sess.current_user) {
		res.render('new-project', { data : req.currentData });
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}

function CREATE_POST(req, res){
	var sess = req.session;
	if (sess.current_user) {
		var project = global.Server.Model.ProjectModel();
		project.name = req.body.name;
		project.user = sess.current_user.id;
		project.save(function(err){
			if(err){
				console.log(err);
				sess.message = { content : 'Error when create project!', type : 'danger' };
				res.redirect('/new-project');
			} else {
				sess.message = { content : 'Create successfully!', type : 'success' };
				res.redirect('/new-project');
			}
		});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}

function SET_Project(req, res){
	var sess = req.session;
	if (sess.current_user) {
		global.Server.Model.ProjectModel.findById( req.params.id, function(err, project) {
			if(err) {
                sess.message = { content : 'Error when getting project', type : 'danger' };
				res.redirect('/');
            } else {
				if ( project ){
					sess.cur_project = project;
					console.log(project);
					console.log(sess.cur_project);
	                sess.message = { content : 'Change project success!', type : 'success' };
					res.redirect('/');
				} else {
	                sess.message = { content : 'Project does not exist', type : 'danger' };
					res.redirect('/');
				}
			}
		});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}

function UPDATE_Project(req, res){
	var sess = req.session;
	if (sess.current_user) {
		global.Server.Model.ProjectModel.update({ _id : sess.cur_project._id},{ $set : { name : req.body.name, url : req.body.url }}, function(err){
			if(err) {
				sess.message = { content : 'Update project failed!', type : 'danger' };
				res.redirect('/');
			} else {
				sess.cur_project.name = req.body.name;
				sess.cur_project.url = req.body.url;
				sess.message = { content : 'Update success!', type : 'success' };
				res.redirect('/');
			}
		});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}

function DELETE_Project(req, res){
	var sess = req.session;
	if (sess.current_user) {
		global.Server.Model.ProjectModel.find({ _id : sess.cur_project._id}).remove(function(err){
			if(err) {
				sess.message = { content : 'Delete project failed!', type : 'danger' };
				res.redirect('/');
			} else {
				sess.cur_project = null;
				sess.message = { content : 'Delete successful!', type : 'success' };
				res.redirect('/');
			}
		});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}


module.exports.GET = GET;
module.exports.POST = POST;
module.exports.PUT = PUT;
module.exports.DELETE = DELETE;
module.exports.CREATE = CREATE;
module.exports.CREATE_POST = CREATE_POST;
module.exports.SET_Project = SET_Project;
module.exports.UPDATE_Project = UPDATE_Project;
module.exports.DELETE_Project = DELETE_Project;